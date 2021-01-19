package main

import (
	"crypto/md5"
	"fmt"
	"log"
	"net/http"
	"text/template"
	"time"

	"github.com/gin-gonic/gin"
)

// service/new

// service/terminate

var router *gin.Engine

var (
	deploymentTemplate, serviceTemplate *template.Template
)

type serviceCreate struct {
	Email    string `form:"email"`
	Password string `form:"password"`
}

func serviceNew(c *gin.Context) {
	var form serviceCreate
	if c.ShouldBind(&form) != nil {
		c.String(http.StatusBadRequest, "service create parameter error")
		return
	}

	log.Printf("receive form: %+v\n", form)

	if len(form.Password) < 8 || len(form.Password) > 16 {
		c.String(http.StatusBadRequest, "password should have length between 8 and 16.")
		return
	}

	name := "t-"
	nbytes := md5.Sum([]byte(form.Email + time.Now().String()))
	name += fmt.Sprintf("%x", nbytes[:])[:30]

	log.Println("creating:", name)
	// Now I can create the service here.
	if !applyF(deploymentTemplate, map[string]string{
		"name":     name,
		"password": form.Password,
	}) {
		c.String(http.StatusInternalServerError, "error creating (1): "+name)
		return
	}

	if !applyF(serviceTemplate, map[string]string{
		"name": name,
	}) {
		c.String(http.StatusInternalServerError, "error creating (2): "+name)
		return
	}

	// add to redis
	err := rdb.HMSet(ctx, "creating", name, form.Email).Err()
	if err != nil {
		c.String(http.StatusInternalServerError, "error saving status(1): "+name)
		return
	}
	err = rdb.HMSet(ctx, "emails", name, form.Email).Err()
	if err != nil {
		c.String(http.StatusInternalServerError, "error saving status(1): "+name)
		return
	}

	err = rdb.HMSet(ctx, "times", name, time.Now().Add(time.Hour).Unix()).Err()
	if err != nil {
		c.String(http.StatusInternalServerError, "error saving status(1): "+name)
		return
	}
	c.String(http.StatusCreated, "Creation done. Please check your email in a while!")
}

func serviceDelete(c *gin.Context) {
	name := c.Param("name")
	log.Println("delete service:", name)

	if !deleteF("deployment", name) {
		c.String(http.StatusInternalServerError, "error deleting (1): "+name)
		return
	}

	if !deleteF("service", name) {
		c.String(http.StatusInternalServerError, "error deleting (2): "+name)
		return
	}

	c.String(http.StatusCreated, "Deletion done. Thank you!")
}

func init() {
	if deploymentTemplate = loadTmp("deployment.yml"); deploymentTemplate == nil {
		panic("cannot load deployment template")
	}
	if serviceTemplate = loadTmp("service.yml"); serviceTemplate == nil {
		panic("cannot load service template")
	}

	router = gin.Default()

	router.POST("/service/new", serviceNew)

	router.GET("/service/terminate/:name", serviceDelete)
}

func main() {
	router.Run(":7070")

}
