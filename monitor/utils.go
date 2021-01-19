package main

import (
	"bytes"
	"context"
	"io/ioutil"
	"log"
	"os/exec"
	"text/template"

	"github.com/go-redis/redis/v8"
	"gopkg.in/yaml.v3"
)

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
