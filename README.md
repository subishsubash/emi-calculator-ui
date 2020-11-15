<h1>Real Time EMI Calculator</h1>
<h2>What it does</h2>


<p>Real Time EMI Calculator allows users to calculate the interest amount that needs to be paid towards the EMIs on monthly basis in real time. This calculates the interest and principal amounts and provides an amortization schedule to the user, which shows the break-up of these amounts to be repaid towards principal and interest along with their respective balances throughout the tenure of the loan. It acts like a handy tool to simulate EMIs for different types of loans such as Home loan, Car loan, Personal loan etc.</p>

----
<h2>Solution Description</h2>


  - The simulation of EMI payment calculation helps user to have a clear or complete idea on how much amount to be paid monthly for the requested loan. The main objective of this     project is to develop an effective EMI calculator as a deliverable using Microservices. 
  - Standalone Microservices based solution, which helps the banks to access specific APIs in which they can configure the required parameters like amount, interest rates and tenure for different types of loans. 
  - Any Banks can easily integrate this solution in their web site (by just embedding in the iframe) without  writing even a single line of code. Therefore, the bank customers can have a clear view on entire of loan EMI structure within milliseconds even before applying it.

----
<h2>API Exposed from Loan Catalog Microservice</h2>

| Method | Operation Id | Description |  
|:-----------|:-----------|:-----------|  
| POST | createLoanType | Create a loan type in Loan Catalog Microservice |  
| PUT | updateLoanType | Update a loan type in Loan Catalog Microservice |
| GET | getLoanType | Fetch the loan Information from Loan Catalog MS.</br>API Will return all the loan’s details by passing All in param |  
| DELETE | deleteLoanType | Delete the loan type and its detail from microserice |
| POST | createCalculatorBoundary | Configure parameter details for given loan type |  
| PUT | updateCalculatorBoundary | Update the parameter details for given loan type |
| GET | getCalculatorBoundary | Fetch the parameter details for a loan type |  

----
<h2>Languages & Frameworks</h2> 

1. FrontEnd
- Angular 10

2. Backend
- Java
- Spring Boot
- MongoDB
- [Backend Repository](https://github.com/subishsubash/emi-calculator) 

----

<h2>Depolyment</h2>

```
docker pull mongo
docker pull subash12396/emi-calculator:emi-calculator-ui
docker pull subash12396/emi-calculator:emi-calculator
docker run --name mongodb -d mongo
docker run --name emi-calculator-ui-container  -d subash12396/emi-calculator:emi-calculator-ui
docker run -p 9090:9090 --link mongodb:mongo --name emi-calculator-container  -d subash12396/emi-calculator:emi-calculator
```

<h2>Testing</h2>

>Microservice APIs

 ```
 http://192.168.99.100:9090
 ```
 >User Interface
 
 ```
 http://192.168.99.100:8080
 ```
 
 >Note: Replace the IP with docker enviornment
 
 >For more API details [refer swagger](https://github.com/subishsubash/emi-calculator/blob/main/emicalculator.yml)
 

