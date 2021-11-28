import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import WithService from '../hoc/hoc';
import AllParticipantsModal from '../allParticipantsModal/allParticipantsModal';
import { connect } from 'react-redux';
import { closeModalAllParticipantsGroup } from '../../actions';

class ModalWindowAllParticipantsGroup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            arr: []
        }
    }

    render() {
        const idInUrl = localStorage.getItem('idGroup');

        const { closeModalAllParticipantsGroup, history } = this.props;

        return (
            <div>
                <AllParticipantsModal getItems={(start, end) =>
                    `/api/group-relation/get-group-accounts/${idInUrl}?start=${start}&end=${end}`
                }
                    arrItems={(items) => {
                        this.setState({
                            arr: [...this.state.arr, ...items.accounts]
                        })
                    }}
                    path={(id) => {
                        closeModalAllParticipantsGroup()
                        history.push(`/account/${id}`)
                    }
                    }
                    renderItems={this.state.arr}
                    titleItem={(el, funcGoItem) => {
                        return el.map(item => {
                            return (
                                <div key={item.account.id}>
                                    <li className="participants-list__item"
                                        onClick={() => funcGoItem(item.account.id)}
                                    >
                                        <div className="participants-list__item__content">
                                            <div className="participants-list__item__content__img">
                                                <img src={"data:image/jpg;base64," + item.account.photo}
                                                    alt="photoGroup"
                                                />
                                            </div>
                                            <span className="participants-list__item__content__name">
                                                {item.account.firstName} {item.account.lastName}
                                            </span>
                                        </div>
                                    </li>
                                </div>
                            )
                        })
                    }}
                    messageNotContent={"Нет участников группы"}
                    nameList={"Всего участников группы: "}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        id: state.userId
    }
}

const mapDispatchToProps = {
    closeModalAllParticipantsGroup
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WithService()(ModalWindowAllParticipantsGroup)));
