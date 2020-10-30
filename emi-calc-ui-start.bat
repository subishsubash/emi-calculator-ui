docker build -t emi-calculator-ui .
docker run -p 8080:8080 --name emi-calculator-ui -d emi-calculator-ui
exit