.PHONY: admin monitor

admin:
	cd admin && go build -o ../bin/admin && cp *.yml ../ && cd ../ && ./bin/admin

monitor:
	cd monitor && go build -o ../bin/monitor && cp *yml ../ && cd ../ && ./bin/monitor