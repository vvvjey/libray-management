import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import './BookRental.scss'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Header from '../../Header/Header';
import SideBar from '../../SideBar/sideBar';
import TableBookRental from './TableBookRental';
import ModalRental from './ModalRental';
import ModalViewRental from './ModalViewRental';
import { FormattedMessage } from 'react-intl';
class BookRental extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpenModalRent: false,
            isOpenModalViewRental: false,
            rentId: undefined,
            selectFilter: "rentId",
            inputSearch: "",
        }
    }
    getRentId = (rentId) => {
        this.setState({
            rentId: rentId
        })
    }
    handleCreateRental = () => {
        this.setState({
            isOpenModalRent: true,
        })
    }
    toggleOrderModal = () => {
        this.setState({
            isOpenModalRent: !this.state.isOpenModalRent,
        })
    }
    toggleViewRentalModal = (id) => {
        this.setState({
            isOpenModalViewRental: !this.state.isOpenModalViewRental,
        })
    }
    handleOnchangeInputFilter = (e, id) => {
        let copyState = { ...this.state }
        copyState[id] = e.target.value;
        this.setState({
            ...copyState
        })
    }
    render() {
        return (
            <div className="d-flex" id="wrapper">
                <ModalRental
                    isOpen={this.state.isOpenModalRent}
                    toggleFromParent={this.toggleOrderModal}
                />
                {
                    this.state.isOpenModalViewRental &&
                    <ModalViewRental
                        isOpen={this.state.isOpenModalViewRental}
                        toggleFromParent={(id) => this.toggleViewRentalModal(id)}
                        rentId={this.state.rentId}
                    />
                }
                <SideBar />
                <div id="page-content-wrapper">
                    <Header />
                    <div className='book-purchase-container'>
                        <div className='book-purchase-header'>
                            <p className='title-header'> <FormattedMessage id='modal.book-rental-title' /></p>
                            <p className='infor-header'></p>
                        </div>
                        <div className='book-purchase-content'>
                            <div className='action'>
                                <div class="input-group form-outline w-50">
                                    <input
                                        style={{ "height": "46px" }}
                                        placeholder={this.props.language === "en" ? "Please enter a search query..." : "Nhập để tìm kiếm..."}
                                        type="text"
                                        className="form-control w-75"
                                        onChange={(e) => this.handleOnchangeInputFilter(e, 'inputSearch')}
                                    />
                                    <div className="input-group-append">
                                        <select
                                            className="form-select w-100 brounded-0"
                                            value={this.state.selectFilter}
                                            onChange={(e) => this.handleOnchangeInputFilter(e, 'selectFilter')}
                                            style={{ "cursor": "pointer" }}
                                        >
                                            <option value={"retalId"}>{this.props.language === "en" ? "Rental ID" : "Mã thuê"}</option>
                                        </select>
                                    </div>
                                </div>
                                <div className='mx-1 button-add'>
                                    <button
                                        className='btn px-3'
                                        onClick={() => this.handleCreateRental()}
                                    ><i className="fa fa-plus"></i> <FormattedMessage id='modal.create-rent-receipt' /></button>
                                </div>
                            </div>
                            <div className='datatable'>
                                <TableBookRental
                                    toggleFromParent={this.toggleViewRentalModal}
                                    getRentId={(rentId) => this.getRentId(rentId)}
                                    optionSearch={[this.state.inputSearch, this.state.selectFilter]}
                                />
                            </div>

                        </div>
                        <div className='book-purchase-footer'></div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookRental);
