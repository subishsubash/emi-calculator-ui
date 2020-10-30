import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as Highcharts from 'highcharts';
import * as chartOptions from 'highcharts';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'loancalculator-ui';

  amortization = [];

  //table
  displayedColumns: string[] = ['months', 'openingBalance', 'emi', 'interestPaid', 'principalPaid', 'closingBalance'];
  dataSource = new MatTableDataSource(this.amortization);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // Tabs
  loanDescList = [];
  loanTypeList = [];
  loanNameList = [];


  // lable values for loan amount
  currencySymbol = "$";
  minLoanAmount = "10K"
  maxLoanAmount = "10M"

  // Slider values for loan amount
  loanAmount_min = 1000;
  // tslint:disable-next-line: variable-name
  loanAmount_max = 10000000;
  loanAmount = 1000;

  // lable values for Terms in month
  mintenure = "12m"
  maxtenure = "480m"

  // Slider values for Terms in month
  tenure_min = 12;
  tenure_max = 480;
  tenureInMonth = 12;

  // lable values for interest rate
  minInterestRate = "5%"
  maxInterestRate = "15%"

  // Slider values for interest rate
  interest_min = 5;
  interest_max = 15;
  interestRate = 5;

  // Formula to calculat total interest


  // Emi Calculation with default value
  monthlyInterestRatio = (this.interestRate / 100) / 12;
  top = Math.pow((1 + this.monthlyInterestRatio), this.tenureInMonth);
  bottom = this.top - 1;
  sp = this.top / this.bottom;
  emiAmount = ((this.loanAmount * this.monthlyInterestRatio) * this.sp);
  emiAmount_ui = Math.round(this.emiAmount);
  // this varibale is used for emi calculation
  //emiAmount = (this.monthlyInterestRatio * -this.loanAmount * Math.pow((1 + this.monthlyInterestRatio), this.tenureInMonth) / (1 - Math.pow((1 + this.monthlyInterestRatio), this.tenureInMonth))).toFixed(4);

  totalInterest = 27;
  totalAmount = this.loanAmount + this.totalInterest;

  // Base value for charts
  // chartDatasets = [
  //   { data: [this.loanAmount, this.totalInterest] }
  // ];

  // chartType = 'pie';
  // public chartLabels: Array<any> = ['Loan Amount', 'Total Interest'];
  // public chartColors: Array<any> = [
  //   {
  //     backgroundColor: ['#F7464A', '#46BFBD'],
  //     hoverBackgroundColor: ['#FF5A5E', '#5AD3D1'],
  //     borderWidth: 3,
  //   }
  // ];
  // public chartOptions: any = {
  //   responsive: true
  // };
  // public chartClicked(e: any): void { }
  // public chartHovered(e: any): void { }

  /**
   * Slider event
   */
  onUpdateValues() {
    console.log(this.tenureInMonth);
    // loan amount
    if(this.loanAmount < this.loanAmount_min) {
      this.loanAmount = this.loanAmount_min;
    }
    if(this.loanAmount > this.loanAmount_max) {
      this.loanAmount = this.loanAmount_max;
    }
    // Tenure months
    if(this.tenureInMonth < this.tenure_min) {
      this.tenureInMonth = this.tenure_min;
    }
    if(this.tenureInMonth > this.tenure_max) {
       this.tenureInMonth = this.tenure_max;
    }
    // Interest ratel
    if(this.interestRate < this.interest_min) {
      this.interestRate = this.interest_min;
    }
    if(this.interestRate > this.interest_max) {
      this.interestRate = this.interest_max;
    }
    console.log("New : "+this.tenureInMonth);

    // Upating charts value dynamically
    this.amortization = [];
    // this.chartDatasets = [
    //   { data: [this.loanAmount, this.totalInterest] }
    // ];
    // console.log(this.chartDatasets);
    this.calculateEmi();
    this.calculateInterest();
    this.calculateTotalPayable();
    this.updateChartOptions();
    this.dataSource.paginator = this.paginator;

  };

  /**
   * Calculate EMI
   */
  calculateEmi() {
    this.monthlyInterestRatio = (this.interestRate / 100) / 12;
    this.top = Math.pow((1 + this.monthlyInterestRatio), this.tenureInMonth);
    this.bottom = this.top - 1;
    this.sp = this.top / this.bottom;
    this.emiAmount = ((this.loanAmount * this.monthlyInterestRatio) * this.sp);
    this.emiAmount_ui = Math.round(this.emiAmount);
    // this varibale is used for emi calculation
    //this.emiAmount = (this.monthlyInterestRatio * -this.loanAmount * Math.pow((1 + this.monthlyInterestRatio), this.tenureInMonth) / (1 - Math.pow((1 + this.monthlyInterestRatio), this.tenureInMonth))).toFixed(4);
  }

  /**
   * Calculate Interest
   */
  calculateInterest() {
    let loanAmount_ui_table = this.loanAmount;
    let totalInterestPaid = 0;
    for (let i = 1; i <= this.tenureInMonth; i++) {
      let interestPaid = 0;
      let principalPaid = 0;
      let closingBalance = 0;
      interestPaid = (loanAmount_ui_table * this.interestRate) / 1200;
      principalPaid = Number(this.emiAmount) - interestPaid;
      closingBalance = loanAmount_ui_table - principalPaid;
      totalInterestPaid = (totalInterestPaid + interestPaid);
      let amortizationtableRow = {
        "months": i,
        "openingBalance": Math.round(loanAmount_ui_table),
        "emi": Math.round(this.emiAmount),
        "interestPaid": Math.round(interestPaid),
        "principalPaid": Math.round(principalPaid),
        "closingBalance": Math.round(closingBalance)
      };
      this.amortization.push(amortizationtableRow);
      loanAmount_ui_table = closingBalance;
    }
    this.totalInterest = Math.round(totalInterestPaid);
    this.dataSource = new MatTableDataSource(this.amortization);
  }

  /**
   * Calculate total payable
   */
  calculateTotalPayable() {
    this.totalAmount = Math.round(this.loanAmount + this.totalInterest);
  }
  loanAmount_graph = this.loanAmount;
  constructor(private http: HttpClient) { }

  
  currentLoanType = "";
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.updateChartOptions();
    // Menu bar API call
    let obsLoanType = this.http.get("http://192.168.99.100:9090/system/loan/ALL")
    obsLoanType.toPromise().then(data => {
      console.log(data);
      let i = 0;
      let loanDetails = data["loanTypes"];
      for (let loanDetail in loanDetails) {
        let loanName = loanDetails[loanDetail]["loanType"];
        let loanDesc = loanDetails[loanDetail]["description"];
        let loanTypeJson = {
          "loanName": loanName,
          "loanDesc": loanDesc
        };
        this.loanTypeList.push(loanTypeJson);
        this.loanNameList.push(loanName);
        this.loanDescList.push(loanDesc);
      }
    });
    let loanEvent = {
      index: 0
    };
    this.onClickGetCalcDetail(loanEvent);
  }

  
  public onClickGetCalcDetail(loanEvent) {
    // Defaulting lable values
    this.amortization = [];
    this.dataSource = new MatTableDataSource(this.amortization);
    this.updateChartOptions();
    let index = loanEvent.index;
    let loanType = this.loanNameList[index];
    let loanTypeInLower = loanType.toLowerCase();
    this.currentLoanType = loanTypeInLower.charAt(0).toUpperCase() + loanTypeInLower.slice(1);
    this.getCalculateDetailAPI(loanType);
    this.onUpdateValues();
  }

  // Calculator details API Call
  getCalculateDetailAPI(loanType: String) {
    let url = "http://192.168.99.100:9090/reference/calculator/settings/" + loanType;
    let obsCalcDetails = this.http.get(url);
    obsCalcDetails.toPromise().then(data => {
      console.log(data);
      // Slider values
      this.loanAmount_min = data["minAmount"];
      this.loanAmount = this.loanAmount_min;
      this.loanAmount_max = data["maxAmount"];
      this.tenure_min = data["minTermsInMonth"];
      this.tenureInMonth = this.tenure_min;
      this.tenure_max = data["maxTermsInMonth"];
      this.interest_min = data["minInterestRate"];
      this.interestRate = this.interest_min;
      this.interest_max = data["maxInterestRate"];
      // Labels
      this.getCurrencyString(data["minAmount"], data["maxAmount"])
      this.minInterestRate = data["minInterestRate"] + "%";
      this.maxInterestRate = data["maxInterestRate"] + "%";
      this.mintenure = data["minTermsInMonth"] + "m";
      this.maxtenure = data["maxTermsInMonth"] + "m";
      this.currencySymbol = data["currencySymbol"];
    });
  }

  // Get min & max labels 
  getCurrencyString(minAmt, maxAmt) {
    //For Thousands (eg: 100K)
    let calcMinAmount = Math.round(minAmt / 1000);
    if (calcMinAmount < 1000) {
      this.minLoanAmount = calcMinAmount + "K";
    }
    else {
      calcMinAmount = Math.round(minAmt / 1000000);
      this.minLoanAmount = Math.round(calcMinAmount) + "M";
    }

    let calcMaxAmount = Math.round(maxAmt / 1000);
    if (calcMaxAmount < 1000) {
      this.maxLoanAmount = calcMaxAmount + "K";
    } else {
      calcMaxAmount = Math.round(maxAmt / 1000000);
      this.maxLoanAmount = calcMaxAmount + "M"
    }
  };

  // High charts
  highcharts = Highcharts;
  chartOptions = {};
  updateChartOptions() {
    this.chartOptions = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        animation: true
      },
      title: {
        text: this.currentLoanType + ' Loan EMI',
        style: {
          fontSize: '100%',
          color: 'gray',
          text: 'sans-serif',
          align: 'left',
          fontWeight: 'bold'
       }
      },
      tooltip: {
        pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            color: 'gray',
            text: 'sans-serif'
          },
          showInLegend: false
        },
      },
      credits: {
        enabled: false
      },
      series: [{
        colorByPoint: true,
        animation:
        {
            duration: 300,
            easing: 'easeOutBounce'
        },
        data: [{
          name: 'Principal Amount',
          y: this.loanAmount
        }, {
          name: 'Total Interest Amount',
          y: this.totalInterest
        }]
      }],
      colors: ['#9FA8DA', '#003e75']
    };
  }

}
