import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import "./ModalRental.scss"
import { faPlus, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as actions from "../../../store/actions/index"
import DataTable from 'react-data-table-component';
import Select from 'react-select';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-flatpickr';
import AccordionItem from 'react-bootstrap/esm/AccordionItem';
import { data } from 'jquery';
import moment from 'moment/moment';
class ModalRental extends Component {

    constructor(props) {
        super(props);
        this.state = {
            totalPrice: 0,
            isExistsCustomer: false,
            leaseDate: undefined,
            dueDate: undefined,
            rentDate: undefined,
            messageSelectBook: "",
            customerId: "",
            customerState: "Gold",
            gender: "Male",
            phoneNumber: "",
            address: "",
            email: "",
            fullName: "",
            customerState: "",
            // discount & books
            options: [],
            selectedOption: "",
            dataTableBookSelect: [],
        }
    }

    handleOnchangeQuantity = (row, e) => {
        // const data = JSON.parse(JSON.stringify(this.state.dataTableBookSelect));
        const data = _.cloneDeep(this.state.dataTableBookSelect);
        let totalMoney = 0;
        data.forEach(item => {
            if (row.title === item.title) {
                item.quantity = e.target.value
                item.totalAmount = item.quantity * item.netAmount
            }
            totalMoney += item.totalAmount
        })
        this.setState({
            dataTableBookSelect: [...data],
            totalPrice: totalMoney,
        })
    }
    handleDeleteItem = (row) => {
        let data = _.cloneDeep(this.state.dataTableBookSelect);
        let totalMoney = this.state.totalPrice
        data.forEach(item => {
            if (row.title === item.title) {
                totalMoney -= item.totalAmount
            }
        })
        let rows = data.filter(item => item.title !== row.title);
        this.setState({
            dataTableBookSelect: [...rows],
            totalPrice: totalMoney
        })
    }
    componentDidMount() {
        this.props.fetchAllBooks();
        this.props.fetchAllCustomers();
        this.props.fetchAllDiscounts();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listBooks !== this.props.listBooks) {
            let options = [];
            this.props.listBooks.forEach(item => {
                options.push(
                    {
                        value: item.id,
                        label: item.bookTitle
                    }
                )
            })
            this.setState({
                options: options
            })
        }
    }
    toggle = () => {
        this.setState({
            totalPrice: 0,
            isExistsCustomer: false,
            dueDate: undefined,
            rentDate: undefined,
            messageSelectBook: "",
            // Create a customer
            customerId: "",
            customerState: "",
            gender: "",
            phoneNumber: "",
            address: "",
            email: "",
            fullName: "",
            customerState: "",
            // discount & books
            selectedOption: "",
            dataTableBookSelect: [],
        })
        this.props.toggleFromParent();
    }
    handleOnchangeInput = (event, id) => {
        const value = event.target.value;
        this.setState(
            { [id]: value },
            () => {
                if (id == "phoneNumber") {
                    this.checkExistsCustomer();
                }
            }
        );
    }

    checkExistsCustomer = () => {
        let isExistsCustomer = false;
        let customerId = "";
        let customerState = "";
        let address = "";
        let email = "";
        let fullName = "";

        if (this.state.phoneNumber) {
            this.props.listCustomers.forEach(customer => {
                if (this.state.phoneNumber === customer.phoneNumber) {
                    isExistsCustomer = true;
                    customerId = customer.customerId;
                    fullName = customer.fullName;
                    customerState = customer.customerState;
                    address = customer.address;
                    email = customer.email;
                    return; // Exit the forEach loop early
                }
            });
        }

        this.setState({
            isExistsCustomer: isExistsCustomer,
            customerId: customerId,
            fullName: fullName,
            customerState: customerState,
            address: address,
            email: email
        });
    }
    handleChange = (selectedOption) => {
        this.setState({
            selectedOption: selectedOption
        })
    };
    handleInsertBookSelect = () => {
        if (!this.state.leaseDate || !this.state.dueDate) {
            this.setState({
                messageSelectBook: "Please fill date !"
            })
            return;
        }
        else {
            this.setState({
                messageSelectBook: "",
            })
        }
        let bookSelected = this.state.selectedOption.label
        let flag = false
        if (!bookSelected) flag = true;
        this.state.dataTableBookSelect.forEach(row => {
            if (bookSelected === row.title) {
                flag = true;
            }
        })
        this.setState({
            selectedOption: "",
        })
        if (!flag) {
            let book;
            this.props.listBooks.forEach(item => {
                if (bookSelected === item.bookTitle) {
                    book = item;
                }
            })
            console.log(book)
            let copyDataTableBook = [...this.state.dataTableBookSelect];
            copyDataTableBook.push(
                {
                    "bookId": book.bookId,
                    'title': book.bookTitle,
                    'quantity': 1,
                    'netAmount': book.sellingPrice * this.state.rentDate * 1.5 / 100,
                    'totalAmount': book.sellingPrice * this.state.rentDate * 1.5 / 100
                }
            )
            let totalMoney = this.state.totalPrice + book.sellingPrice * this.state.rentDate * 1.5 / 100;
            this.setState({
                dataTableBookSelect: copyDataTableBook,
                totalPrice: totalMoney
            })
        }
    }
    handlePaid = () => {
        let dataBook = [];
        this.state.dataTableBookSelect.forEach((item) => {
            dataBook.push({
                quantity: item.quantity,
                bookId: item.bookId
            });
        });
        if (this.state.isExistsCustomer) {
            this.props.CreateRentExistsCustomer(
                {
                    customerId: this.state.customerId,
                    dateReturn: this.state.dueDate,
                    dayRent: this.state.rentDate
                },
                dataBook
            )
        }
        else {
            this.props.CreateRentNotExistsCustomer(
                {
                    fullName: this.state.fullName,
                    rank: this.state.customerState,
                    sex: this.state.gender,
                    phoneNumber: this.state.phoneNumber,
                    address: this.state.address,
                    email: this.state.email,
                },
                {
                    dateReturn: this.state.dueDate,
                    dayRent: this.state.rentDate
                }
                ,
                dataBook
            )
        }
        this.toggle()
    }
    handleChangeRentDay = (date, id) => {
        this.setState(
            { [id]: date },
        );
        let leaseDate = new Date(this.state.leaseDate);
        leaseDate.setHours(0, 0, 0, 0);
        let dueDate = new Date(this.state.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        this.setState({
            rentDate: Math.abs(dueDate.getTime() - leaseDate.getTime()) / (1000 * 60 * 60 * 24) + 1
        })
        console.log("check rentDate: ", this.state.rentDate)
    }
    render() {
        return (
            <Modal
                isOpen={this.props.isOpen}
                // isOpen={true}
                toggle={() => { this.toggle() }}
                className={'modal-book-container'}
                size='lg'
            >
                <ModalHeader toggle={() => { this.toggle() }}><FormattedMessage id='modal.create-rent-receipt' /></ModalHeader>
                <ModalBody>
                    <div className='modal-book-body'>
                        <div className='input-container'
                            style={{ "width": "49%" }}
                        >
                            <label><FormattedMessage id='modal.phone-number' /></label>
                            <div className='d-flex'>
                                <input
                                    value={this.state.phoneNumber}
                                    type='text'
                                    style={{ "width": "100%" }}
                                    onChange={(e) => this.handleOnchangeInput(e, 'phoneNumber')}
                                />
                            </div>
                        </div>

                        {
                            this.state.isExistsCustomer &&
                            <>
                                <div
                                    className='input-container'
                                    style={{ "width": "49%" }}
                                >
                                    <label><FormattedMessage id='modal.name' /></label>
                                    <input
                                        disabled={true}
                                        type='text'
                                        value={this.state.fullName}
                                    />
                                </div>
                                <div
                                    className='input-container'
                                    style={{ "width": "49%" }}
                                >
                                    <label><FormattedMessage id='modal.email' /></label>
                                    <input
                                        disabled={true}
                                        type='text'
                                        value={this.state.email}
                                    />
                                </div>
                                <div
                                    className='input-container'
                                    style={{ "width": "49%" }}
                                >
                                    <label><FormattedMessage id='modal.address' /></label>
                                    <input
                                        disabled={true}
                                        type='text'
                                        value={this.state.address}
                                    />
                                </div>
                            </>
                        }
                        {
                            !this.state.isExistsCustomer &&
                            <>
                                <div
                                    className='input-container'
                                    style={{ "width": "49%" }}
                                >
                                    <label><FormattedMessage id='modal.name' /></label>
                                    <input
                                        type='text'
                                        value={this.state.fullName}
                                        onChange={(e) => this.handleOnchangeInput(e, 'fullName')}
                                    />
                                </div>

                                <div className='input-container'
                                    style={{ "width": "49%" }}
                                >
                                    <label><FormattedMessage id='modal.gender' /></label>
                                    <div className='select-genre'>
                                        <select
                                            className='form-select'
                                            value={this.state.gender}
                                            onChange={(e) => this.handleOnchangeInput(e, 'gender')}
                                        >
                                            <option value={"Male"}>{this.props.language === "en" ? "Male" : "Nam"}</option>
                                            <option value={'Female'}>{this.props.language === "en" ? "Female" : "Nữ"}</option>
                                            <option value={"Other"}>{this.props.language === "en" ? "Other" : "Khác"}</option>
                                        </select>
                                    </div>
                                </div>
                                <div className='input-container'
                                    style={{ "width": "49%" }}
                                >
                                    <label><FormattedMessage id='modal.customer-state' /></label>
                                    <div className='select-genre'>
                                        <select
                                            className='form-select'
                                            value={this.state.customerState}
                                            onChange={(e) => this.handleOnchangeInput(e, 'customerState')}
                                        >
                                            <option value={"Gold"}>{this.props.language === "en" ? "Gold" : "Vàng"}</option>
                                            <option value={'Silver'}>{this.props.language === "en" ? "Silver" : "Bạc"}</option>
                                            <option value={"Bronze"}>{this.props.language === "en" ? "Bronze" : "Đồng"}</option>
                                        </select>
                                    </div>
                                </div>
                                <div className='input-container'
                                    style={{ "width": "49%" }}
                                >
                                    <label><FormattedMessage id='modal.email' /></label>
                                    <input
                                        type='text'
                                        value={this.state.email}
                                        onChange={(e) => this.handleOnchangeInput(e, 'email')}
                                    />
                                </div>
                                <div className='input-container'
                                    style={{ "width": "49%" }}
                                >
                                    <label><FormattedMessage id='modal.address' /></label>
                                    <input
                                        type='text'
                                        value={this.state.address}
                                        onChange={(e) => this.handleOnchangeInput(e, 'address')}
                                    />
                                </div>
                            </>
                        }
                        <div className='input-container'
                            style={{ "width": "49%" }}
                        >
                            <label><FormattedMessage id='modal.lease-start-date' /></label>
                            <DatePicker
                                value={this.state.leaseDate}
                                name='leaseDate'
                                onChange={(date) => { this.handleChangeRentDay(date, "leaseDate") }}
                            />
                        </div>
                        <div className='input-container' style={{ width: "49%" }}>
                            <label><FormattedMessage id='modal.due-date' /></label>
                            <DatePicker
                                selected={this.state.dueDate}
                                name='dueDate'
                                onChange={(date) => { this.handleChangeRentDay(date, "dueDate") }}
                            />
                        </div>

                    </div>
                    <div className='select-container d-flex mt-3 mb-3' style={{ width: "100%", justifyContent: "center" }}>
                        <div style={{ width: "400px", position: "relative", zIndex: "2" }}>
                            <Select
                                value={this.state.selectedOption}
                                onChange={this.handleChange}
                                options={this.state.options}
                            />
                        </div>
                        <button
                            style={{ width: "80px" }}
                            className="border-0 btn btn-primary ml-2"
                            type="button"
                            onClick={this.handleInsertBookSelect}
                        >
                            <FontAwesomeIcon icon={faPlus} className='mr-1' />
                            <FormattedMessage id='modal.insert' />
                        </button>
                    </div>
                    {
                        this.state.messageSelectBook &&
                        <div
                            style={{ "display": "flex", "alignContent": "center", "justifyContent": "center", "color": "red" }}
                        >
                            {this.state.messageSelectBook}
                        </div>
                    }
                    {
                        <DataTable
                            columns={
                                [
                                    {
                                        name: this.props.language === "en" ? "Book Title" : "Tên sách",
                                        selector: 'title',
                                        sortable: true,
                                    },
                                    {
                                        name: this.props.language === "en" ? "Quantity" : "Số lượng",
                                        selector: 'quantity',
                                        cell:
                                            (row) =>
                                                <input
                                                    defaultValue={row.quantity}
                                                    type="number"
                                                    min={1}
                                                    max={10000}
                                                    style={{
                                                        "width": "80px",
                                                        "border": "none",
                                                        "height": "20px",
                                                        'background': "#c6c5c52e",
                                                        "border-radius": "3px"
                                                    }}
                                                    onChange={(e) => { this.handleOnchangeQuantity(row, e) }}
                                                />
                                    },
                                    {
                                        name: this.props.language === "en" ? "Net Amount" : "Giá thuê",
                                        selector: "netAmount",
                                    },
                                    {
                                        name: this.props.language === "en" ? "Total Amount" : "Tổng tiền",
                                        selector: "totalAmount",
                                    },
                                    {
                                        name: this.props.language === "en" ? "Delete" : "Xóa",
                                        cell:
                                            (row) =>
                                                <div
                                                    className='d-flex justify-content-between w-75'>
                                                    <button
                                                        className='border-0 bg-transparent'
                                                        onClick={() => { this.handleDeleteItem(row) }}
                                                        data-tag="allowRowEvents"
                                                    >
                                                        <FontAwesomeIcon
                                                            className='icon-right text-danger'
                                                            icon={faTrash}
                                                        />
                                                    </button>
                                                </div>,
                                        ignoreRowClick: true,
                                        allowOverflow: true,
                                        button: true,
                                    },
                                ]
                            }
                            data={this.state.dataTableBookSelect}
                            fixedHeader
                            fixedHeaderScrollHeight="330px"
                        />
                    }
                    {
                        this.state.dataTableBookSelect.length !== 0 &&
                        <div className="w-100 border-top border-2 mt-1">
                            <div className='d-flex'
                                style={{ "align-items": "center", "justifyContent": "left" }}
                            >
                                <label className='mr-2'>{this.props.language === "end" ? "Total Amount: " : "Tổng tiền: "} {this.state.totalPrice}</label>
                            </div>
                        </div>
                    }
                </ModalBody>
                <ModalFooter style={{ "justifyContent": "space-evenly" }}>
                    <Button
                        style={{ "height": "40px", "width": "150px" }}
                        className='px-5 border-0 bg-danger'
                        onClick={() => { this.handlePaid() }}
                    ><FormattedMessage id='modal.paid' /></Button>
                    <Button
                        style={{ "height": "40px", "width": "150px" }}
                        className='px-5 border-0 bg-primary'
                        onClick={() => this.toggle()}
                    ><FormattedMessage id='modal.cancel' /></Button>
                </ModalFooter>
            </Modal >
        )
    }

}
const mapStateToProps = state => {
    return {
        listCustomers: state.customer.listCustomers,
        listBooks: state.book.listBooks,
        listDiscounts: state.discount.listDiscounts,
        language: state.app.language,
    };
};
const mapDispatchToProps = dispatch => {
    return {
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language)),
        fetchAllCustomers: () => dispatch(actions.fetchAllCustomersStart()),
        createNewCustomer: (data) => dispatch(actions.createNewCutomer(data)),
        fetchAllBooks: () => dispatch(actions.fetchAllBooksStart()),
        fetchAllDiscounts: () => dispatch(actions.fetchAllDiscountsStart()),
        // Rent
        CreateRentNotExistsCustomer: (dataCustomer, dataRent, dataBook) => dispatch(actions.CreateRentNotExistsCustomer(dataCustomer, dataRent, dataBook)),
        CreateRentExistsCustomer: (dataRent, dataBook) => dispatch(actions.CreateRentExistsCustomer(dataRent, dataBook)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalRental);
