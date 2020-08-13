import EmployeeContract from "../build/contracts/Employee.json";
import contract from "truffle-contract"

export default async(provider) => {
    const employed = contract(EmployeeContract);
    employed.setProvider(provider);

    let instance = await employed.deployed();
    return instance;
};