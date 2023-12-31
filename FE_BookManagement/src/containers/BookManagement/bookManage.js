import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import './bookManage.scss'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { emitter } from '../../utils/emitter';
import {
    createNewBookService,
    getAllBooks,
    editBookService,
    deleteBookService
} from '../../services/bookService'
import { FormattedMessage } from 'react-intl';
import Header from '../Header/Header';
import SideBar from '../SideBar/sideBar';
import ModalBook from './ModalBook';
import TableBookManage from './TableBookManage';
import ModalEditBook from './ModalEditBook';
import ModalDeleteBook from './ModalDeleteBook';
class BookManage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            bookDeleteId: "",
            bookEditId: "",
            arrBooks: [],
            isOpenModalUser: false,
            isOpenModalEditBook: false,
            isOpenModalDeleteBook: false,
            inputSearch: "",
            selectFilter: "bookId",
            editAction: 'edit',
        }
    }
    async componentDidMount() {
        await this.getAllBooksFromReact();
    }
    getAllBooksFromReact = async () => {
        let response = await getAllBooks('ALL');
        if (response && response.errCode === 0) {
            this.setState({
                arrBooks: response.books
            })
        }
    }
    handleAddNewBook = () => {
        this.setState({
            isOpenModalUser: true,
        })
    }
    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser,
        })
    }
    toggleBookEditModal = (id) => {
        this.setState({
            isOpenModalEditBook: !this.state.isOpenModalEditBook,
            editAction: id
        })
    }
    toggleBookDeleteModal = () => {
        this.setState({
            isOpenModalDeleteBook: !this.state.isOpenModalDeleteBook,
        })
    }
    getBookEdit = (book) => {
        this.setState({
            bookEditId: book
        })
    }
    getBookDelete = (bookId) => {
        this.setState({
            bookDeleteId: bookId
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
                <ModalBook
                    isOpen={this.state.isOpenModalUser}
                    toggleFromParent={this.toggleUserModal}
                />
                {
                    this.state.isOpenModalEditBook &&
                    <ModalEditBook
                        isOpen={this.state.isOpenModalEditBook}
                        toggleFromParent={(id) => this.toggleBookEditModal(id)}
                        bookEditId={this.state.bookEditId}
                        editAction={this.state.editAction}
                    />
                }
                {
                    this.state.isOpenModalDeleteBook &&
                    <ModalDeleteBook
                        isOpen={this.state.isOpenModalDeleteBook}
                        toggleFromParent={this.toggleBookDeleteModal}
                        bookDeleteId={this.state.bookDeleteId}
                    />
                }
                <SideBar />
                <div id="page-content-wrapper">
                    <Header />
                    <div className='book-manage-container'>
                        <div className='book-manage-header'>
                            <p className='title-header'> <FormattedMessage id='book-management.book-management' /></p>
                            <p className='infor-header'> <FormattedMessage id='book-management.title' /></p>
                        </div>
                        <div className='book-manage-content'>
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
                                            className="form-select w-100 rounded-0"
                                            value={this.state.selectFilter}
                                            onChange={(e) => this.handleOnchangeInputFilter(e, 'selectFilter')}
                                            style={{ "cursor": "pointer" }}
                                        >
                                            <option value={"bookId"}>{this.props.language === "en" ? "Book ID" : "Mã sách"}</option>
                                            <option value={"bookTitle"}>{this.props.language === "en" ? "Book title" : "Tên sách"}</option>
                                            <option value={"authorName"}>{this.props.language === "en" ? "Author" : "Tên tác giả"}</option>
                                            <option value={"genre"}>{this.props.language === "en" ? "Genre" : "Thể loại"}</option>
                                        </select>
                                    </div>
                                </div>
                                <div className='mx-1 button-add w-25'>
                                    <button
                                        className='btn px-3'
                                        onClick={() => this.handleAddNewBook()}
                                    ><i className="fa fa-plus mr-1"></i>
                                        <FormattedMessage id='book-management.btn-add-new-book' />
                                    </button>
                                </div>
                            </div>
                            <div className='datatable'>
                                <TableBookManage
                                    toggleFromParent={this.toggleBookEditModal}
                                    toggleBookDeleteModal={this.toggleBookDeleteModal}
                                    getBookEdit={(bookInfor) => this.getBookEdit(bookInfor)}
                                    getBookDelete={(bookId) => this.getBookDelete(bookId)}
                                    optionSearch={[this.state.inputSearch, this.state.selectFilter]}
                                />
                            </div>

                        </div>
                        <div className='book-manage-footer'></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(BookManage);
