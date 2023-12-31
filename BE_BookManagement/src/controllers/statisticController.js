import db, { sequelize } from "../models/index"


async function GetMonthStaticstic(month) {
    let monthlyRevenue = 0
    let monthlyNewCustomer = 0
    let monthlyBookSoldQuantity = 0
    const invoices = await db.Invoice.findAll({
        where: sequelize.where(sequelize.fn('month', sequelize.col('createdAt')), month)
    })
    const rents = await db.Rent.findAll({
        where: sequelize.where(sequelize.fn('month', sequelize.col('createdAt')), month)
    })
    const customers = await db.Customer.findAll({
        where: sequelize.where(sequelize.fn('month', sequelize.col('createdAt')), month)
    })
    const invoiceDetails = await db.InvoiceDetail.findAll({
        where: sequelize.where(sequelize.fn('month', sequelize.col('createdAt')), month)
    })
    invoices.forEach(invoice => {
        monthlyRevenue += invoice.customerPay
    })
    rents.forEach(rent => {
        monthlyRevenue += rent.rentPrice
    })
    customers.forEach(customer => {
        monthlyNewCustomer++;
    })
    invoiceDetails.forEach(invoiceDetail => {
        monthlyBookSoldQuantity += invoiceDetail.quantity
    })
    let monthlyStatistic = {
        monthlyRevenue: monthlyRevenue,
        monthlyNewCustomer: monthlyNewCustomer,
        monthlyBookSoldQuantity: monthlyBookSoldQuantity,
    }
    return monthlyStatistic
}

async function GetYearStatistic(req, res) {
    try {
        let yearStatistic = []
        for (let i = 0; i < 12; i++) {
            yearStatistic[i] = await GetMonthStaticstic(i + 1)
            yearStatistic[i].month = i
        }
        res.status(200).json({
            errCode: 0,
            yearStatistic: yearStatistic
        })
    } catch (e) {
        res.status(400).json({
            errCode: 1,
            errMess: e.message
        })
    }
}


async function GetCurrentMonthStatistic(req, res) {
    try {
        const month = (new Date()).getMonth() + 1
        let monthlyStatistic = await GetMonthStaticstic(month)
        let prevMonthlyStatistic = await GetMonthStaticstic(month - 1)
        // percentageRevenue
        if (prevMonthlyStatistic.monthlyRevenue === 0) {
            monthlyStatistic.percentageRevenue = (monthlyStatistic.monthlyRevenue - prevMonthlyStatistic.monthlyRevenue)
        } else {
            monthlyStatistic.percentageRevenue = ((monthlyStatistic.monthlyRevenue - prevMonthlyStatistic.monthlyRevenue) / prevMonthlyStatistic.monthlyRevenue) * 100
        }
        monthlyStatistic.percentageRevenueStatus = monthlyStatistic.monthlyRevenue > prevMonthlyStatistic.monthlyRevenue ? 'ascend' : monthlyStatistic.monthlyRevenue < prevMonthlyStatistic.monthlyRevenue ? lower : 'equal'
        // percentageNewCustomer
        if (prevMonthlyStatistic.monthlyNewCustomer === 0) {
            monthlyStatistic.percentageNewCustomer = (monthlyStatistic.monthlyNewCustomer - prevMonthlyStatistic.monthlyNewCustomer)
        } else {
            monthlyStatistic.percentageNewCustomer = ((monthlyStatistic.monthlyNewCustomer - prevMonthlyStatistic.monthlyNewCustomer) / prevMonthlyStatistic.monthlyNewCustomer)
        }
        monthlyStatistic.percentageNewCustomerStatus = monthlyStatistic.monthlyNewCustomer > prevMonthlyStatistic.monthlyNewCustomer ? 'ascend' : monthlyStatistic.monthlyNewCustomer < prevMonthlyStatistic.monthlyNewCustomer ? lower : 'equal'
        // percentageBookSoldQuantity
        if (prevMonthlyStatistic.monthlyBookSoldQuantity === 0) {
            monthlyStatistic.percentageBookSoldQuantity = (monthlyStatistic.monthlyBookSoldQuantity - prevMonthlyStatistic.monthlyBookSoldQuantity)
        } else {
            monthlyStatistic.percentageBookSoldQuantity = ((monthlyStatistic.monthlyBookSoldQuantity - prevMonthlyStatistic.monthlyBookSoldQuantity) / prevMonthlyStatistic.monthlyBookSoldQuantity) * 100
        }
        monthlyStatistic.percentageBookSoldQuantityStatus = monthlyStatistic.monthlyBookSoldQuantity > prevMonthlyStatistic.monthlyBookSoldQuantity ? 'ascend' : monthlyStatistic.monthlyBookSoldQuantity < prevMonthlyStatistic.monthlyBookSoldQuantity ? lower : 'equal'
        res.status(200).json({
            errCode: 0,
            monthlyStatistic: monthlyStatistic
        })
    } catch (e) {
        res.status(400).json({
            errCode: 1,
            errMessage: e.message
        })
    }
}


module.exports = {
    GetCurrentMonthStatistic: GetCurrentMonthStatistic,
    GetYearStatistic: GetYearStatistic,
}