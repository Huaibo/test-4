import React, { Component } from 'react';
import CSVReader from 'react-csv-reader';
import {Bar} from "react-chartjs-2";
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:[],
            chartsdata : {},
        options : {
            scales: {
                yAxes: [
                    {
                        ticks: {
                            callback: function(label, index, labels) {
                                return label;
                            }
                        }
                    }
                ]
            },
        }
        };
    }

     handleCSV = data =>
    {
        this.setState({
            data:data.slice(1),
        })
        this.chartCSV();
    }

    sortCSV =(isAsec,index)=>{
        let result =[];
        switch (index){
            case (0):
                result=this.state.data.sort((a,b)=>{
                    return isAsec?a[index]-b[index]:b[index]-a[index];
                });
                break;
            case (1):
            case (2):
            case (3):
                result=this.state.data.sort((a,b)=>{
                    let flag = isAsec?1:-1;
                    if(a[index] < b[index]) return -1*flag;
                    if(a[index] > b[index]) return 1*flag;
                    return 0;
                });
                break;
            case (5):
            case (6):
                result=this.state.data.sort((a,b)=>{
                    const numA = a[index]?parseInt(a[index].substring(1)):0;
                    const numB =b[index]?parseInt(b[index].substring(1)):0;
                    return isAsec?numA-numB:numB-numA;
                });
                break;
            default:
                result = this.state.data;
                break;

        };
        this.setState({
            data:result,
        })
        }
    chartCSV = ()=>{
        //todo get chart scale
        if(this.state.data.length===0)
        {
            return;
        }
        //todo count scale
        let CreditData=[0,0,0,0,0];
        let DebitData=[0,0,0,0,0];
        //count credit
        for(let i =0;i<1000;i++) {
            let credit = parseInt(this.state.data[i][5].substring(1));
            let debit = parseInt(this.state.data[i][6].substring(1));
            switch (true) {
                case(credit<20|| !credit):
                    CreditData[0]++;
                    break;
                case(credit>20&&credit<40):
                    CreditData[1]++;
                    break;
                case(credit>40&&credit<60):
                    CreditData[2]++;
                    break;
                case(credit>60&&credit<80):
                    CreditData[3]++;
                    break;
                case(credit>80&&credit<100):
                    CreditData[4]++;
                    break;
            }
            switch (true) {
                case(debit<20|| !debit):
                    DebitData[0]++;
                    break;
                case(debit>20&&debit<40):
                    DebitData[1]++;
                    break;
                case(debit>40&&debit<60):
                    DebitData[2]++;
                    break;
                case(debit>60&&debit<80):
                    DebitData[3]++;
                    break;
                case(debit>80&&debit<100):
                    DebitData[4]++;
                    break;
            }
        }
        this.setState({
            chartsdata: {labels: ['$0-$20', '$20-$40', '$40-$60', '$60-$80', '$80-$100'],datasets:[{data:CreditData,backgroundColor: "#ff1e4d",label:'credit'},
                    {data:DebitData,backgroundColor: "#5645ff",label:'debit'}]},
        })
    }

    renderList() {
        return this.state.data.map((elm,index)=> {
                    return (<li key={elm[0]}>
                        <div className="row">
                            <div className="col-1 csvColumn">{elm[0]}</div>
                            <div className="col-1 csvColumn">{elm[1]}</div>
                            <div className="col-1 csvColumn">{elm[2]}</div>
                            <div className="col-3 csvColumn">{elm[3]}</div>
                            <div className="col-1 csvColumn">{elm[4]}</div>
                            <div className="col-1 csvColumn">{elm[5]}</div>
                            <div className="col-1 csvColumn">{elm[6]}</div>
                        </div>
                    </li>)
            }
        )
    }
  render() {
    return (
      <div className="App">

          <div>
          <Reader onCSVLoaded={i => this.handleCSV(i)}/>
          </div>
          <div>
              {this.state.data.length > 0 &&
              <Bar data={this.state.chartsdata} options={this.state.options} />
              }
          </div>
              <ul className='csvList'>
                  <li>
                      <div className="row">
                          <SortButton onClickSort={(isAsec,index)=>this.sortCSV(isAsec,index)} index={0}  colName='id'/>
                          <SortButton onClickSort={(isAsec,index)=>this.sortCSV(isAsec,index)} index={1}  colName='first_name'/>
                          <SortButton onClickSort={(isAsec,index)=>this.sortCSV(isAsec,index)} index={2}  colName='last_name'/>
                          <SortButton onClickSort={(isAsec,index)=>this.sortCSV(isAsec,index)} index={3}  colName='email'/>
                          <SortButton onClickSort={(isAsec,index)=>this.sortCSV(isAsec,index)} index={4}  colName='gender'/>
                          <SortButton onClickSort={(isAsec,index)=>this.sortCSV(isAsec,index)} index={5}  colName='credit'/>
                          <SortButton onClickSort={(isAsec,index)=>this.sortCSV(isAsec,index)} index={6}  colName='debit'/>
                      </div>
                  </li>
                  {this.renderList()}
              </ul>
          </div>
    );
  }
}

export class Reader extends Component {
    render() {
        return (
            <CSVReader
                cssClass="csv-input"
                label="Please select CSV file"
                onFileLoaded={this.props.onCSVLoaded}
                onError={handleErr}
            />
        )
    }
}
export class SortButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAsec:true,
        };
    }

    onclick=()=>{
        this.setState({
            isAsec:!this.state.isAsec,
        },()=>{
            this.props.onClickSort(this.state.isAsec,this.props.index);
        });

    };
    render() {
        let colLength = this.props.index!==3?'col-1':'col-3';
        return (
            <button onClick={this.onclick} className= {'csvColumn '+colLength}>
                { this.props.colName}
            </button>
        )
    }
}

function handleErr(){
}

export default App;
