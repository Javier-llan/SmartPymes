import React, { Component } from "react";
import Panel from "./Panel";
import getWeb3 from "./getWeb3";
import EmployeeContract from "./employee";
import { EmployeeService } from "./employeeService";
import { ToastContainer } from "react-toastr";



const converter = (web3) => {
    return (value) => {
        return web3.utils.fromWei(value.toString(), 'ether');
    }
}

export class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            balance: 0,
            refundableEther: 0,
            account: undefined,
            employeds: [],
            workedEmployeds: []
        };
    }

async componentDidMount() {
    this.web3 = await getWeb3();
    this.toEther = converter(this.web3);
    this.employee = await EmployeeContract(this.web3.currentProvider);
    this.employeeService = new EmployeeService(this.employee);

    var account = (await this.web3.eth.getAccounts())[0];
    
    let employedPurchased = this.employee.EmployedPurchased();
        employedPurchased.watch(function (err, result) {

            const { worked, salary, employed } = result.args;

            if (worked === this.state.account) {
                console.log(`Contratacion del empleado ${employed} con un salario de ${salary}`);
            } else {
                this.container.success(`Ultimo usuario contrato al empleado ${employed}
                con un salario ${salary}`, 'Información contratación');
            }

        }.bind(this));

    this.setState({
        account: account.toLowerCase()
    }, () => {
        this.load();
    });
}
async getBalance() {
    let weiBalance = await this.web3.eth.getBalance(this.state.account);
    this.setState({
        balance: this.toEther(weiBalance)
    });
}

async getRefundableEther() {
    let refundableEther = this.toEther((await this.employeeService.getRefundableEther(this.state.account)));
    this.setState({
        refundableEther
    });
}

async refundLoyaltyPoints() {
    await this.employeeService.redeemLoyaltyPoints(this.state.account);
}



async buyEmployed(employedIndex, employed) {

    await this.employeeService.buyEmployed(
        employedIndex,
        this.state.account,
        employed.salary
    );
}


    async getEmployeds() {
        let employeds = await this.employeeService.getEmployeds();
        this.setState({
            employeds
        });
    }

    async getWorkedEmployeds() {
        let workedEmployeds = await this.employeeService.getWorkedEmployeds(this.state.account);
        this.setState({
            workedEmployeds
        });
    }
    async load(){
        this.getBalance();
        this.getEmployeds();
        this.getWorkedEmployeds();
        this.getRefundableEther();
    }
    render() {
        return <React.Fragment>
            <div className="jumbotron">
                <h4 className="display-4">Prototipo de SmartPymes!</h4>
            </div>

            <div className="row">
                <div className="col-sm">
                    <Panel title="Cuenta y saldo disponible">
                     <p><strong>{this.state.account}</strong></p>
                    <span><strong>Saldo actual:</strong> {this.state.balance}</span>
                    </Panel>
                </div>
                <div className="col-sm">
                    <Panel title="Cantidad de ether disponible para cobro">
                    <span>{this.state.refundableEther} eth</span>
                        <button className="btn btn-sm bg-success text-white"
                            onClick={this.refundLoyaltyPoints.bind(this)}>Cobrar</button>
                    </Panel>
                </div>
            </div>
            <div className="row">
                <div className="col-sm">
                    <Panel title="Nuevos Empleados">
                    {this.state.employeds.map((employed, i) => {
                            return <div key={i}>
                                <span>{employed.name} - cost: {this.toEther(employed.salary)/2}</span>
                                <button className="btn btn-sm btn-success text-white" onClick={() => this.buyEmployed(i, employed)}>Contratar</button>
                            </div>
                        })}

                    </Panel>
                </div>
                <div className="col-sm">
                    <Panel title="Empleados Contratados">
                    {this.state.workedEmployeds.map((employed, i) => {
                            return <div key={i}>
                                {employed.name} - cost: {employed.salary}
                            </div>
                        })}
                    </Panel>
                </div>
            </div>
            <ToastContainer ref={(input) => this.container = input}
                className="toast-top-right" />
        </React.Fragment>
    }
}