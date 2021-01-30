package main

import (
	"encoding/base64"
	"fmt"
	"io/ioutil"
	"net/mail"
	"net/smtp"

	"crypto/tls"
	"net"

	"gopkg.in/yaml.v3"
)

var emailSender EmailMessenger

func init() {
	emailConfigBytes, err := ioutil.ReadFile("email.yml")
	if err != nil {
		panic(err)
	}

	yaml.Unmarshal(emailConfigBytes, &emailSender)
}

// EmailMessenger ...
// Save the password and SMTP address here.
type EmailMessenger struct {
	SMTPServer string `yaml:"server"`
	Email      string `yaml:"email"`
	Password   string `yaml:"password"`
}

// EmailSendForm ...
type EmailSendForm struct {
	Subject    string
	Body       string
	FromEmail  string
	ToEmail    string
	SenderName string
}

// Send ...
func (em *EmailMessenger) Send(form EmailSendForm) error {
	b64 := base64.NewEncoding("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/")

	host := em.SMTPServer
	email := em.Email
	password := em.Password
	from := mail.Address{Name: "Hippo IDE", Address: form.FromEmail}
	to := mail.Address{Name: "User", Address: form.ToEmail}

	header := make(map[string]string)
	header["From"] = from.String()
	header["To"] = to.String()
	header["Subject"] = fmt.Sprintf("=?UTF-8?B?%s?=", b64.EncodeToString([]byte(form.Subject)))
	header["MIME-Version"] = "1.0"
	header["Content-Type"] = "text/html; charset=UTF-8"
	header["Content-Transfer-Encoding"] = "base64"

	message := ""
	for k, v := range header {
		message += fmt.Sprintf("%s: %s\r\n", k, v)
	}
	message += "\r\n" + b64.EncodeToString([]byte(form.Body))
	auth := smtp.PlainAuth(
		"",
		email,
		password,
		host,
	)
	err := SendTLSMail(
		host+":465",
		auth,
		email,
		[]string{to.Address},
		[]byte(message),
	)

	return err
}

// SendTLSMail ...
// use TLS and 465 port
func SendTLSMail(addr string, auth smtp.Auth, from string, to []string, msg []byte) (err error) {

	// create smtp client
	conn, err := tls.Dial("tcp", addr, &tls.Config{InsecureSkipVerify: true})
	if err != nil {
		return err
	}
	host, _, _ := net.SplitHostPort(addr)
	c, err := smtp.NewClient(conn, host)

	if err != nil {
		// Create smpt client error
		return err
	}
	defer c.Close()
	if auth != nil {
		if ok, _ := c.Extension("AUTH"); ok {
			if err = c.Auth(auth); err != nil {
				// Error during AUTH
				return err
			}
		}
	}
	if err = c.Mail(from); err != nil {
		return err
	}

	for _, addr := range to {
		if err = c.Rcpt(addr); err != nil {
			return err
		}
	}

	w, err := c.Data()
	if err != nil {
		return err
	}

	_, err = w.Write(msg)
	if err != nil {
		return err
	}

	err = w.Close()
	if err != nil {
		return err
	}
	return c.Quit()
}

// SendEmailReady ...
func SendEmailReady(em EmailMessenger, userEmail string, ipaddress string, paramString string) error {
	url := "http://hippo-ide.apartsa.com/service/terminate/" + paramString // http://127.0.0.1:8000
	ipaddress = "http://" + ipaddress + ":3049/"
	// based := "http://hippo.apartsa.com/" + base64.StdEncoding.EncodeToString([]byte(ipaddress))
	based := ipaddress
	form := EmailSendForm{
		Subject:    "Apartsa Hippo IDE Ready",
		Body:       fmt.Sprintf("Your IDE's IP address is <a href='%s'>%s</a>.<br>You have 1 hour to use it. It will automatically terminate after 1 hour.<br><br>To terminate it actively, you can click the following link: <a href='%s'>%s</a> <br><br>Best regards,<br>Apartsa Hippo IDE Team", based, based, url, url),
		FromEmail:  "no-reply@apartsa.com",
		ToEmail:    userEmail,
		SenderName: "Apartsa Hippo IDE Team",
	}
	return em.Send(form)
}

// SendEmailTTL ...
func SendEmailTTL(em EmailMessenger, userEmail string, ipaddress string) error {
	ipaddress = "http://" + ipaddress + ":3049/"
	// based := "http://hippo.apartsa.com/" + base64.StdEncoding.EncodeToString([]byte(ipaddress))
	based := ipaddress
	form := EmailSendForm{
		Subject:    "Apartsa Hippo IDE Terminated",
		Body:       fmt.Sprintf("Your IDE on IP address %s has run out of time.<br>Thank you for using Hippo IDE.<br><br>Best regards,<br>Apartsa Hippo IDE Team", based),
		FromEmail:  "no-reply@apartsa.com",
		ToEmail:    userEmail,
		SenderName: "Apartsa Hippo IDE Team",
	}
	return em.Send(form)
}
