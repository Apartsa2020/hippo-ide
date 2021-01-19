package main

import (
	"bytes"
	"context"
	"io/ioutil"
	"log"
	"os"
	"os/exec"
	"text/template"

	"github.com/go-redis/redis/v8"
	"gopkg.in/yaml.v3"
)

var defaultImageName = "ccr.ccs.tencentyun.com/code-server/csc3050"
var ctx = context.Background()
var rdb *redis.Client

type kube struct {
	WorkloadName string
	ServiceName  string
	ImageName    string
}

func (k *kube) Init(wn, sn, in string) {
	k = &kube{
		WorkloadName: wn,
		ServiceName:  sn,
		ImageName:    in,
	}
}

func loadTmp(filename string) *template.Template {
	bytes, err := ioutil.ReadFile(filename)
	if err != nil {
		log.Println(err)
		return nil
	}
	tmp, err := template.New(filename).Parse(string(bytes))
	if err != nil {
		log.Println(err)
		return nil
	}
	return tmp
}

func output(tmp *template.Template, params map[string]string) string {
	if tmp == nil {
		return ""
	}
	var buffer bytes.Buffer
	if err := tmp.Execute(&buffer, params); err != nil {
		log.Println(err)
		return ""
	}
	return buffer.String()
}

func applyF(tmp *template.Template, params map[string]string) bool {
	value := output(tmp, params)
	if value == "" {
		return false
	}

	file, err := ioutil.TempFile("./", "temp-*.yml")
	if err != nil {
		log.Println(err)
		return false
	}
	defer os.Remove(file.Name())

	log.Println("filename:", file.Name(), value)

	err = ioutil.WriteFile(file.Name(), []byte(value), os.ModeTemporary)
	if err != nil {
		log.Println(err)
		return false
	}

	cmd := exec.Command("kubectl", "apply", "-f", file.Name(), "--validate=false")
	log.Println(cmd)
	err = cmd.Run()
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}

// t: deployment or service
func deleteF(t string, name string) bool {
	cmd := exec.Command("kubectl", "delete", t, name)
	err := cmd.Run()
	if err != nil {
		log.Println(err)
		return false
	}
	return true
}

type redisConfig struct {
	Addr     string `json:"addr"`
	Password string `json:"password"`
}

func connectRedis(configFile string) *redis.Client {
	bytes, err := ioutil.ReadFile(configFile)
	if err != nil {
		log.Println("cannot read redis config file")
		return nil
	}

	var config redisConfig
	if yaml.Unmarshal(bytes, &config) != nil {
		log.Println("cannot decode redis config file")
		return nil
	}

	log.Println(config)

	rdb := redis.NewClient(&redis.Options{
		Addr:     config.Addr,
		Password: config.Password,
		DB:       0, // use default DB
	})

	if rdb == nil || rdb.Ping(ctx).Err() != nil {
		return nil
	}
	return rdb
}

func init() {
	if rdb = connectRedis("redis.yml"); rdb == nil {
		panic("fail to connect to redis")
	}
}
