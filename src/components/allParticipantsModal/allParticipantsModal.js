import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import WithService from '../hoc/hoc';
import { connect } from 'react-redux';
import { closeModalAllParticipantsGroup, checkingForAuthorization, unsubscribe } from '../../actions';
import './allParticipantsModal.scss';
import Spinner from '../spinner/spinner';
import SpinnerMini from '../spinnerMini/spinnerMini';
import cancel from './cancel.svg';

class AllParticipantsModal extends Component {
    _cleanupFunction = false;
    constructor(props) {
        super(props);
        this.state = {
            req: false,
            heightList: '',
            totalSize: '',
            searchValue: '',
            spinner: true,
            miniSpinner: false,
            error: false
        }

        this.refList = React.createRef();
        const {
            Service,
            getItems,
            arrItems,
            checkingForAuthorization,
            unsubscribe,
            path,
            openModalAllParticipantsGroup,
            closeModalAllParticipantsGroup } = this.props;
        let start = 0;
        let end = 10;

        this.componentDidMount = () => {
            this._cleanupFunction = true;
            this.getItems()
        }

        this.componentDidUpdate = () => {
            if (this.refList.current !== null && this.refList.current !== undefined && !this.state.error) {
                const list = document.querySelector('.participants-list__modal');
                const windowHeight = list.clientHeight;
                list.addEventListener("scroll", () => {
                    let scrollTop = list.scrollTop;
                    const heightList = this.refList.current.scrollHeight;
                    if (heightList !== this.state.heightList && !this.state.error) {
                        if (this._cleanupFunction) {
                            this.setState({
                                heightList: heightList
                            })
                        }
                    }
                    if ((scrollTop + windowHeight) >=
                        (this.state.heightList / 100 * 80) && !this.state.req && !this.state.error) {
                        start = end;
                        end = end + 10;
                        if (start === this.state.totalSize) {
                            return
                        }
                        if (start > this.state.totalSize) {
                            return
                        }
                        if (end > this.state.totalSize) {
                            end = this.state.totalSize
                        }
                        if (this._cleanupFunction) {
                            this.setState({
                                req: true,
                                miniSpinner: true
                            })
                        }
                        Service.getItems(getItems(start, end))
                            .then(res => {
                                if (res.status === 200) {
                                    if (this._cleanupFunction) {
                                        this.setState({
                                            totalSize: res.data.totalSize,
                                            req: false,
                                            miniSpinner: false
                                        })
                                        arrItems(res.data)
                                    }
                                }
                            }).catch(err => {
                                if (this._cleanupFunction) {
                                    this.setState({
                                        error: true,
                                        spinner: false
                                    })
                                }
                                if (err.response.status === 401) {
                                    unsubscribe()
                                    checkingForAuthorization();
                                }
                            })
                    }
                })
            }
            window.addEventListener('click', (e) => {
                const overlay = document.querySelector('.participants-list');
                if (overlay !== undefined && e.target === overlay && openModalAllParticipantsGroup) {
                    this.closeModalAllParticipantsGroupFunc()
                }
            })
        }

        this.componentWillUnmount = () => {
            const list = document.querySelector('.participants-list__modal');
            list.removeEventListener('scroll', () => { })
            window.removeEventListener('click', ()=>{})
            this._cleanupFunction = false
        }

        this.getItems = () => {
            this.setState({
                searchValue: this.props.valueSearch
            })
            start = 0;
            end = 10;
            Service.getItems(getItems(start, end))
                .then(res => {
                    if (res.status === 200) {
                        if (this._cleanupFunction) {
                            this.setState({
                                totalSize: res.data.totalSize,
                                spinner: false
                            })
                            arrItems(res.data);
                        }
                    }
                }).catch(err => {
                    if (this._cleanupFunction) {
                        this.setState({
                            error: true,
                            spinner: false
                        })
                    }
                    if (err.response.status === 401) {
                        unsubscribe()
                        checkingForAuthorization();
                    }
                })
        }

        this.closeModalAllParticipantsGroupFunc = () => {
            closeModalAllParticipantsGroup()
        }

        this.goToItem = (id) => {
            path(id)
        }

    }

    render() {

        const { spinner, miniSpinner, error, totalSize } = this.state;
        const { renderItems, messageNotContent, titleItem, nameList } = this.props;

        let contentAndMessageNotContent = null;

        if (renderItems.length === 0 && !spinner) {
            contentAndMessageNotContent = <div className="participants-list__not-content">
                <span>{messageNotContent}</span>
            </div>
        }

        const miniSpinnerBlock = miniSpinner ?
            <div className="participants-list__wrapper_spinner-mini">
                <SpinnerMini />
            </div> : null;

        if (renderItems.length > 0 && !spinner) {
            contentAndMessageNotContent = <div>
                <div className="participants-list__list__wrapper">
                    {titleItem(renderItems, this.goToItem)}
                </div>
                {miniSpinnerBlock}
            </div>
        }

        if (error && !spinner) {
            contentAndMessageNotContent = <div className="participants-list__not-content">
                <span>Что-то пошло не так!</span>
            </div>
        }
        
        const content = spinner ? <Spinner /> : contentAndMessageNotContent

        return (
            <div className="participants-list">
                <div className="participants-list__modal" ref={this.refList}>
                    <div className="participants-list__cancel"
                        onClick={this.closeModalAllParticipantsGroupFunc}>
                        <img src={cancel} alt="cancel" />
                    </div>
                    <div className="participants-list__total-size">
                        {nameList}
                        <span>
                            {totalSize}
                        </span>
                    </div>
                    <ul className="participants-list__list">
                        {content}
                    </ul>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        openModalAllParticipantsGroup: state.openModalAllParticipantsGroup
    }
}

const mapDispatchToProps = {
    closeModalAllParticipantsGroup,
    checkingForAuthorization,
    unsubscribe
}

export default withRouter(WithService()(connect(mapStateToProps, mapDispatchToProps)(AllParticipantsModal)));