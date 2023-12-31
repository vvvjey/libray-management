import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import "./ModalBook.scss"
import { emitter } from '../../utils/emitter';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as actions from "../../store/actions/index"
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';
class ModalBook extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errMessage: "",
            isOpenInputGenre: false
        }
        this.formikRef = React.createRef();
    }
    handleAddNewBook = (values, resetForm) => {
        this.props.createNewBook(
            {
                bookTitle: values.bookTitle,
                stock: values.quantity,
                genre: values.genre,
                author: values.author,
                costPrice: values.costPrice
            }
        );
        this.toggle();
        resetForm();
    }
    toggle = () => {
        this.props.toggleFromParent();
        this.formikRef.current.resetForm();
    }
    toggleInputGenre = () => {
        this.setState({
            isOpenInputGenre: !this.state.isOpenInputGenre
        })
    }
    // Define input validation
    inputSchema = Yup.object().shape({
        quantity: Yup.string()
            .test("is-valid", "Wrong format!", function (value) {
                if (!value) return true;
                if (isNaN(value)) return false; // Check if it's a valid number
                return true;
            })
            .required("Required!"),
        costPrice: Yup.string()
            .test("is-valid", "Wrong format!", function (value) {
                if (!value) return true;
                if (isNaN(value)) return false; // Check if it's a valid number
                return true;
            })
            .required("Required!"),
        bookTitle: Yup.string().required("Required!"),
        genre: Yup.string().required("Required!"),
        author: Yup.string().required("Required!"),
    })
    render() {
        return (
            <Formik
                initialValues={{
                    bookTitle: '',
                    genre: '',
                    quantity: '',
                    costPrice: '',
                    author: ''
                }}
                validationSchema={this.inputSchema}
                onSubmit={(values, { resetForm }) => this.handleAddNewBook(values, resetForm)}
                innerRef={this.formikRef}
            >
                {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
                    <Modal
                        isOpen={this.props.isOpen}
                        toggle={() => { this.toggle() }}
                        className={'modal-book-container'}
                        size='lg'
                    >
                        <ModalHeader toggle={() => { this.toggle() }}><FormattedMessage id='modal.add-new-book' /></ModalHeader>
                        <ModalBody>
                            <div className='modal-book-body'>
                                <div
                                    className='input-container'
                                    style={{ "width": "49%" }}
                                >
                                    <label><FormattedMessage id='modal.booktitle' /></label>
                                    <input
                                        className='w-100'
                                        type='text'
                                        name='bookTitle'
                                        value={values.bookTitle}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.bookTitle &&
                                        touched.bookTitle &&
                                        <p
                                            style={{
                                                'position': 'absolute',
                                                'margin-top': '60px',
                                                'margin-left': '2px',
                                                'color': 'red',
                                                'font-style': 'italic',
                                            }}
                                        >{errors.bookTitle}</p>
                                    }
                                </div>
                                <div
                                    className='input-container'
                                    style={{ "width": "49%" }}
                                >
                                    <label><FormattedMessage id='modal.quantity' /></label>
                                    <input
                                        className='w-100'
                                        type='text'
                                        name='quantity'
                                        value={values.quantity}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.quantity &&
                                        touched.quantity &&
                                        <p
                                            style={{
                                                'position': 'absolute',
                                                'margin-top': '60px',
                                                'margin-left': '2px',
                                                'color': 'red',
                                                'font-style': 'italic',
                                            }}
                                        >{errors.quantity}</p>}
                                </div>
                                <div className='input-container d-flex w-100'>
                                    <label><FormattedMessage id='modal.genre' /></label>
                                    <div className='select-genre d-flex'>
                                        <select
                                            disabled={this.state.isOpenInputGenre}
                                            style={this.state.isOpenInputGenre ? { "display": "none" } : { "width": "49%" }}
                                            className='form-select'
                                            value={values.genre}
                                            name='genre'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        >
                                            <option value={this.props.language === "en" ? "Literature" : "Văn học"}>{this.props.language === "en" ? "Literature" : "Văn học"}</option>
                                            <option value={this.props.language === "en" ? "Mystery" : "Trinh thám"}>{this.props.language === "en" ? "Mystery" : "Trinh thám"}</option>
                                            <option value={this.props.language === "en" ? "Science Fiction" : "Khoa học viễn tưởng"}>{this.props.language === "en" ? "Science Fiction" : "Khoa học viễn tưởng"}</option>
                                            <option value={this.props.language === "en" ? "Historical Fiction" : "Tiểu thuyết lịch sử"}>{this.props.language === "en" ? "Historical Fiction" : "Tiểu thuyết lịch sử"}</option>
                                            <option value={this.props.language === "en" ? "Biography " : "Tiểu sử"}>{this.props.language === "en" ? "Biography " : "Tiểu sử"}</option>
                                            <option value={this.props.language === "en" ? "Self-help" : "Phát triển bản thân"}>{this.props.language === "en" ? "Self-help" : "Phát triển bản thân"}</option>
                                            <option value={this.props.language === "en" ? "Philosophy " : "Triết học"}>{this.props.language === "en" ? "Philosophy " : "Triết học"}</option>
                                            <option value={this.props.language === "en" ? "Cookbook " : "Sách nấu ăn"}>{this.props.language === "en" ? "Cookbook " : "Sách nấu ăn"}</option>
                                        </select>
                                        {
                                            this.state.isOpenInputGenre &&
                                            <input
                                                placeholder={this.props.language === "en" ? "Add new genre..." : "Nhập thể loại mới.."}
                                                className=''
                                                style={{ width: "49%" }}
                                                value={values.genre}
                                                name='genre'
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                        }
                                        <button
                                            className={this.state.isOpenInputGenre ? "border-0 btn btn-primary ml-2 bg-danger" : "border-0 btn btn-primary ml-2"}
                                            type="button"
                                            onClick={() => { this.toggleInputGenre() }}
                                        >
                                            <FontAwesomeIcon icon={this.state.isOpenInputGenre ? faMinus : faPlus} />
                                        </button>
                                    </div>
                                    {errors.genre &&
                                        touched.genre &&
                                        <p
                                            style={{
                                                'position': 'absolute',
                                                'margin-top': '60px',
                                                'margin-left': '2px',
                                                'color': 'red',
                                                'font-style': 'italic',
                                            }}
                                        >{errors.genre}</p>}
                                </div>
                                <div
                                    className='input-container'
                                    style={{ "width": "49%" }}
                                >
                                    <label><FormattedMessage id='modal.author' /></label>
                                    <input
                                        type='text'
                                        name='author'
                                        value={values.author}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.author &&
                                        touched.author &&
                                        <p
                                            style={{
                                                'position': 'absolute',
                                                'margin-top': '60px',
                                                'margin-left': '2px',
                                                'color': 'red',
                                                'font-style': 'italic',
                                            }}
                                        >{errors.author}</p>}
                                </div>
                                <div className='input-container'
                                    style={{ "width": "49%" }}
                                >
                                    <label><FormattedMessage id='modal.cost-price' /></label>
                                    <input
                                        type='text'
                                        name='costPrice'
                                        value={values.costPrice}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.costPrice &&
                                        touched.costPrice &&
                                        <p
                                            style={{
                                                'position': 'absolute',
                                                'margin-top': '60px',
                                                'margin-left': '2px',
                                                'color': 'red',
                                                'font-style': 'italic',
                                            }}
                                        >{errors.costPrice}</p>}
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter className='mt-3'>
                            <Button
                                style={{ "height": "40px", "width": "150px" }}
                                className='px-5 border-0 bg-danger' onClick={this.toggle}><FormattedMessage id='modal.cancel' /></Button>
                            <Button
                                style={{ "height": "40px", "width": "150px" }}
                                className='px-5 border-0 bg-primary' type='submit' onClick={handleSubmit}>
                                <FormattedMessage id='modal.add' />
                            </Button>
                        </ModalFooter>
                    </Modal >
                )
                }
            </Formik>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        createNewBook: (data) => dispatch(actions.createNewBook(data)),
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalBook);
