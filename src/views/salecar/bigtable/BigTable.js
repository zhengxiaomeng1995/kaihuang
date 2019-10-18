import React, {Component} from 'react';
import {connect} from 'dva';
import {Table, Button, Modal} from 'antd';

import columnsMap from './columnsMap.js';
import './bigtable.less';
import ModalInner from './ModalInner.js';

@connect(
    ({bigtable}) => ({
        ...bigtable
    })
)
export default class BigTable extends Component {
    constructor () {
        super();
        this.state = {
            showChangeColumnModal: false
        };
    }
    // 组件即将上树
    componentWillMount () {
        this.props.dispatch({'type': 'bigtable/GETCOLUMNSFROMLOCALSTORAGE'});
        this.props.dispatch({'type': 'bigtable/INIT'});
    }
    render () {
        return (
            <div>
                <Modal
                    title="请调整表格列的显示"
                    visible={this.state.showChangeColumnModal}
                    footer={null}
                    onCancel={()=>{
                        this.setState({
                            showChangeColumnModal: false
                        });
                    }}
                >
                    <ModalInner ref='modalinner' okHandler={(columns)=>{
                        // 点击确定按钮之后做的事情
                        this.props.dispatch({'type': 'bigtable/SETCOLUMNSTOLOCALSTORAGE', columns});
                        this.setState({
                            showChangeColumnModal: false
                        });
                    }} cancelHandler={(columns)=>{
                        // 点击取消按钮之后做的事情
                        this.setState({
                            showChangeColumnModal: false
                        });
                    }} />
                </Modal>

                <div className="button_box">
                    <Button
                        className="btn"
                        type="primary"
                        shape="circle"
                        icon="setting"
                        onClick={()=>{
                            this.setState({
                                showChangeColumnModal: true
                            });
                        }}
                    />
                </div>
                <Table
                    rowKey="id"
                    columns={
                        this.props.columnArr.map(str => ({
                            'key': str,
                            'dataIndex': str,
                            ...columnsMap[str]
                        }))
                    }
                    dataSource={this.props.results}
                />
            </div>
        );
    }
}
