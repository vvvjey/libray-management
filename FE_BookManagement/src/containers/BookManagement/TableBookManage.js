import React, { Component, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import "./TableBookManage.scss";
import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { data } from 'jquery';
class TableBookManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            columns: [{
                name: "BookID",
                selector: 'id',
                sortable: true,
                sortFunction: this.caseInsensitiveSort,
            },
            {
                name: "BookTitle",
                selector: 'bookTitle',
            },
            {
                name: "Author",
                selector: "authorName",
            },
            {
                name: "Genre",
                selector: "genre",
            },
            {
                name: "Quantity",
                selector: "quantity",
            },
            {
                cell:
                    (row) =>
                        < button
                            className='border-0 bg-transparent'
                            onClick={() => { this.handleEditBook(row) }}
                            data-tag="allowRowEvents"
                        >
                            <FontAwesomeIcon
                                className='icon-right text-primary'
                                icon={faPenToSquare}
                            />
                        </button >,
                ignoreRowClick: true,
                allowOverflow: true,
                button: true,
            },
            {
                cell: (row) =>
                    <button
                        className='border-0 bg-transparent'
                        onClick={() => { this.handleDeleteBook(row) }}
                        data-tag="allowRowEvents"
                    >
                        <FontAwesomeIcon
                            className='icon-right text-danger'
                            icon={faTrash}
                        />
                    </button>,
                ignoreRowClick: true,
                allowOverflow: true,
                button: true,
            }
            ],
            dataTableBook: [],
            paginationComponentOptions: {
                rowsPerPageText: 'Filas por página',
                rangeSeparatorText: 'de',
                selectAllRowsItem: true,
                selectAllRowsItemText: 'Todos',
            }
        }
    }

    handleEditBook = (row) => {
        this.props.getBookEdit(row)
        this.props.toggleFromParent();
    }
    handleDeleteBook = (row) => {
        this.props.getBookDelete(row.id)
        this.props.toggleBookDeleteModal();
    }
    caseInsensitiveSort = (rowA, rowB) => {
        var a = rowA.title.toLowerCase();
        var b = rowB.title.toLowerCase();

        if (a > b) {
            return 1;
        }

        if (b > a) {
            return -1;
        }

        return 0;
    };
    componentDidMount() {
    }

    toggle = () => {
        this.props.toggleFromParent();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.arrBooks != this.props.arrBooks) {
            let arr = []
            this.props.arrBooks.map((item, index) => {
                arr.push(item)
            })
            this.setState({
                dataTableBook: arr
            })
        }
    }
    render() {
        return (
            <Fragment>
                <DataTable
                    columns={this.state.columns}
                    data={this.state.dataTableBook}
                    pagination
                    paginationComponentOptions={this.paginationComponentOptions}
                    fixedHeader
                    fixedHeaderScrollHeight="435px"
                />
            </Fragment>

        )
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableBookManage);
