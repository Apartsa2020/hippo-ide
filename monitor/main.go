package main

import (
	"log"
	"os/exec"
	"strconv"
	"strings"
	"sync"
	"time"
)

type status struct {
	name string
	ip   string
}

func getAllStatus() map[string]status {
	cmd := exec.Command("kubectl", "get", "services")
	bytes, err := cmd.Output()
	if err != nil {
		log.Println(err)
		return nil
	}

	// log.Println(string(bytes))

	lines := strings.Split(string(bytes), "\n")
	lines = lines[1 : len(lines)-1]
	ss := make(map[string]status, 0)
	for _, line := range lines {
		keys := strings.Fields(line)

		if len(keys) < 5 {
			log.Println("error: shorter keys", keys)
			continue
		}
		ss[keys[0]] = status{
			name: keys[0],
			ip:   keys[3],
		}
	}

	return ss
}

func sendNotification() {
	log.Println("sending notification")
	ss := getAllStatus()
	creatingMap, err := rdb.HGetAll(ctx, "creating").Result()
	if err != nil {
		log.Println(err)
		return
	}

	for name, email := range creatingMap {
		if stat, has := ss[name]; has && stat.ip != "" && stat.ip != "<none>" && stat.ip != "<pending>" {
			// we should send email now.
			log.Printf("send email to %s: %s\n", email, stat.ip)

			SendEmailReady(emailSender, email, stat.ip, name)
			// and remove it from creating.
			rdb.HDel(ctx, "creating", name)
		}
	}
	log.Println("send notification done.")
}

func notificationRoutine() {
	for {
		sendNotification()
		time.Sleep(time.Second * time.Duration(5))
	}
}

func terminateTTL() {
	log.Println("terminating")
	ss := getAllStatus()
	timeMap, err := rdb.HGetAll(ctx, "times").Result()
	if err != nil {
		log.Println(err)
		return
	}

	var current = time.Now().Unix()

	for name, timeString := range timeMap {
		timeUnix, _ := strconv.ParseInt(timeString, 10, 64)
		if timeUnix < current {
			deleteF("deployment", name)
			deleteF("service", name)

			emailInterface, _ := rdb.HMGet(ctx, "emails", name).Result()
			var email string
			if len(emailInterface) == 1 {
				email = emailInterface[0].(string)
			}

			if stat, has := ss[name]; has && stat.ip != "" && stat.ip != "<none>" {
				// we should send email now.
				log.Printf("send email to %s: %s\n", email, stat.ip)

				if email != "" {
					SendEmailTTL(emailSender, email, stat.ip)
				}
				// and remove it from creating.
				rdb.HDel(ctx, "times", name)
				rdb.HDel(ctx, "emails", name)
			}
		}
	}
	log.Println("terminating done.")
}

func terminatingRoutine() {
	for {
		terminateTTL()
		time.Sleep(time.Second * time.Duration(10))
	}
}
func init() {

}

func main() {
	var wg sync.WaitGroup
	wg.Add(1)
	go notificationRoutine()
	go terminatingRoutine()
	wg.Wait()
}
