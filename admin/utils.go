package main

import (
	"bytes"
	"io/ioutil"
	"log"
	"os"
	"os/exec"
	"text/template"
)

var defaultImageName = "ccr.ccs.tencentyun.com/code-server/csc3050"

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
