import React, { Component } from 'react';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index'
import { FormattedMessage } from 'react-intl';
import "./sideBar.scss"
import { Link } from 'react-router-dom/cjs/react-router-dom';
import { NavLink } from 'react-router-dom';
import { faEllipsisVertical, faRightFromBracket, faCircleUser, faShoppingCart, faRetweet } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { USER_ROLE } from '../../utils/constant';
import ModalMyInfor from './Infor/ModalMyInfor';
import { faHome, faBook, faUserCircle, faBoxesStacked, faTags, faBan, faUserAlt, faCartShopping } from '@fortawesome/free-solid-svg-icons';
class SideBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            role: "",
            // isOpenProfile: false
        }
    }
    componentDidMount() {
        this.setState({
            role: this.props.userInfor.role,
        })
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.role !== this.state.role) {
            this.setState({
                role: this.props.userInfor.role,
            })
        }
    }
    toggle = () => {
        this.setState({
            isOpenProfile: !this.state.isOpenProfile
        })
    }
    render() {
        const { processLogout, language, userInfo } = this.props;
        return (
            <React.Fragment>
                {
                    <ModalMyInfor
                        isOpen={this.state.isOpenProfile}
                        toggleProfile={this.toggle}
                    />
                }
                <div className="border-end sidebar-container" id="sidebar-wrapper">
                    <div className="sidebar-heading bg-light">
                        <div className='logo'></div>
                        <p className='title'>BookHolic Management</p>
                    </div>
                    <div className='sidebar-infor'>
                        <div className='avatar'></div>
                        <div className='infor-user'>
                            <p className='name'>{this.props.userInfor.name}</p>
                            <p className='role'>{this.props.userInfor.role}</p>
                        </div>
                        <div class="dropdown dropleft">
                            <button
                                class="btn"
                                type="button"
                                id="dropdownMenuButton"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            // style={ }
                            >
                                <FontAwesomeIcon icon={faEllipsisVertical} fontSize={'20px'} color='#fff' />
                            </button>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <a
                                    style={{ "cursor": "pointer" }}
                                    className="dropdown-item text-primary"
                                    // to='/profile'
                                    onClick={() => { this.toggle() }}
                                >
                                    <FontAwesomeIcon icon={faCircleUser} className='mr-2' fontSize={'17px'} />
                                    {/* My Profile */}
                                    <FormattedMessage id='sidebar.profile' />
                                </a>
                                <NavLink
                                    className="dropdown-item text-danger"
                                    to="/login"
                                    onClick={processLogout}
                                >
                                    <FontAwesomeIcon icon={faRightFromBracket} color='red' className='mr-2' fontSize={'17px'} />
                                    {/* Logout */}
                                    <FormattedMessage id='sidebar.logout' />
                                </NavLink>
                            </div>
                        </div>
                    </div>
                    {this.state.role === USER_ROLE.MANAGER &&
                        <div className="list-group list-group-flush">
                            <NavLink className="d-flex align-items-center bg-transparent list-group-item list-group-item-action list-group-item-light p-3" to='/home'>
                                <FontAwesomeIcon
                                    font-size={'20px'}
                                    icon={faHome} />
                                <p><FormattedMessage id='sidebar.home' /></p>
                            </NavLink>
                            <NavLink className="d-flex align-items-center bg-transparent list-group-item list-group-item-action list-group-item-light p-3" to='/book-management'>
                                <FontAwesomeIcon
                                    font-size={'20px'}
                                    icon={faBook} />
                                <p><FormattedMessage id='sidebar.book-management' /></p>
                            </NavLink>
                            <NavLink className="d-flex align-items-center bg-transparent list-group-item list-group-item-action list-group-item-light p-3" to="/book-purchase">
                                <FontAwesomeIcon
                                    font-size={'20px'}
                                    icon={faCartShopping}
                                />
                                <p><FormattedMessage id='sidebar.book-purchase' /></p>
                            </NavLink>
                            <NavLink className="d-flex align-items-center bg-transparent list-group-item list-group-item-action list-group-item-light p-3" to="/book-rental">
                                <FontAwesomeIcon
                                    font-size={'20px'}
                                    icon={faRetweet}
                                />
                                <p><FormattedMessage id='sidebar.book-rental' /></p>
                            </NavLink>
                            <NavLink className="d-flex align-items-center bg-transparent list-group-item list-group-item-action list-group-item-light p-3" to="/customer-management">
                                <FontAwesomeIcon
                                    font-size={'20px'}
                                    icon={faUserCircle} />
                                <p><FormattedMessage id='sidebar.customer-management' /></p>
                            </NavLink>
                            <NavLink className="d-flex align-items-center bg-transparent list-group-item list-group-item-action list-group-item-light p-3" to="/supplier-management">
                                <FontAwesomeIcon
                                    font-size={'20px'}
                                    icon={faBoxesStacked} />
                                <p><FormattedMessage id='sidebar.supplier-management' /></p>
                            </NavLink>
                            <NavLink className="d-flex align-items-center bg-transparent list-group-item list-group-item-action list-group-item-light p-3" to="/user-management">
                                <FontAwesomeIcon
                                    font-size={'20px'}
                                    icon={faUserAlt} />
                                <p><FormattedMessage id='sidebar.user-management' /></p>
                            </NavLink>
                            <NavLink className="d-flex align-items-center bg-transparent list-group-item list-group-item-action list-group-item-light p-3" to="/discount-management">
                                <FontAwesomeIcon
                                    font-size={'20px'}
                                    icon={faTags} />
                                <p><FormattedMessage id='sidebar.discount' /></p>
                            </NavLink>
                            <NavLink className="d-flex align-items-center bg-transparent list-group-item list-group-item-action list-group-item-light p-3" to="/regulation-management">
                                <FontAwesomeIcon
                                    font-size={'20px'}
                                    icon={faBan} />
                                <p><FormattedMessage id='sidebar.regulations' /></p>
                            </NavLink>
                        </div>
                    }
                    {this.state.role === USER_ROLE.EMPLOYEE &&
                        <div className="list-group list-group-flush">
                            <NavLink className="d-flex align-items-center bg-transparent list-group-item list-group-item-action list-group-item-light p-3" to='/home'>
                                <FontAwesomeIcon
                                    font-size={'20px'}
                                    icon={faHome} />
                                <p><FormattedMessage id='sidebar.home' /></p>
                            </NavLink>
                            <NavLink className="d-flex align-items-center bg-transparent list-group-item list-group-item-action list-group-item-light p-3" to='/book-management'>
                                <FontAwesomeIcon
                                    font-size={'20px'}
                                    icon={faBook} />
                                <p><FormattedMessage id='sidebar.book-management' /></p>
                            </NavLink>
                            <NavLink className="d-flex align-items-center bg-transparent list-group-item list-group-item-action list-group-item-light p-3" to="/book-purchase">
                                <FontAwesomeIcon
                                    font-size={'20px'}
                                    icon={faCartShopping}
                                />
                                <p><FormattedMessage id='sidebar.book-purchase' /></p>
                            </NavLink>
                            <NavLink className="d-flex align-items-center bg-transparent list-group-item list-group-item-action list-group-item-light p-3" to="/book-rental">
                                <FontAwesomeIcon
                                    font-size={'20px'}
                                    icon={faRetweet}
                                />
                                <p><FormattedMessage id='sidebar.book-rental' /></p>
                            </NavLink>
                            <NavLink className="d-flex align-items-center bg-transparent list-group-item list-group-item-action list-group-item-light p-3" to="/customer-management">
                                <FontAwesomeIcon
                                    font-size={'20px'}
                                    icon={faUserCircle} />
                                <p><FormattedMessage id='sidebar.customer-management' /></p>
                            </NavLink>
                        </div>
                    }
                    {this.state.role === USER_ROLE.SUPPORTER &&
                        <div className="list-group list-group-flush">
                            <NavLink className="d-flex align-items-center bg-transparent list-group-item list-group-item-action list-group-item-light p-3" to='/home'>
                                <FontAwesomeIcon
                                    font-size={'20px'}
                                    icon={faHome} />
                                <p><FormattedMessage id='sidebar.home' /></p>
                            </NavLink>
                            <NavLink className="d-flex align-items-center bg-transparent list-group-item list-group-item-action list-group-item-light p-3" to="/user-management">
                                <FontAwesomeIcon
                                    font-size={'20px'}
                                    icon={faUserAlt} />
                                <p><FormattedMessage id='sidebar.user-management' /></p>
                            </NavLink>
                        </div>
                    }

                </div>
            </React.Fragment >
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        userInfor: state.user.userInfor
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        handleChangeLanguageAppRedux: (language) => dispatch(actions.changeLanguageApp(language)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
