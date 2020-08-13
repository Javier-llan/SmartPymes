export class EmployeeService {
    constructor(contract) {
        this.contract = contract;
    }

    async buyEmployed(employedIndex, from, value) {
        return this.contract.buyEmployed(employedIndex, { from, value });
    }

    async buyEmployed(employedIndex, from, value) {
        return this.contract.buyEmployed(employedIndex, { from, value });
    }

    async getEmployeds() {
        let total = await this.getTotalEmployeds();
        let employeds = [];
        for (var i = 0; i < total; i++) {
            let employed = await this.contract.employeds(i);
            employeds.push(employed);
        }

        return this.mapEmployeds(employeds);
    }

    async getWorkedEmployeds(account) {

        let workedTotalEmployeds = await this.contract.workedTotalEmployeds(account);
        let Employeds = [];
        for (var i = 0; i < workedTotalEmployeds.toNumber(); i++) {
            let employed = await this.contract.workedEmployeds(account, i);
            employeds.push(employed);
        }

        return this.mapEmployeds(employeds);
    }

    async getTotalEmployeds() {
        return (await this.contract.totalEmployeds()).toNumber();
    }

    getRefundableEther(from) {
        return this.contract.getRefundableEther({ from });
    }

    redeemLoyaltyPoints(from) {
        return this.contract.redeemLoyaltyPoints({ from });
    }

    mapEmployeds(employeds) {
        return employeds.map(employed => {
            return {
                name: employed[0],
                salary: employed[1].toNumber()
            }
        });
    }

}