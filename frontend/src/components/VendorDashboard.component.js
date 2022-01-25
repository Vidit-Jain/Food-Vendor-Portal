import React, { useState } from 'react';
import 'antd/dist/antd.css';
import axios from "axios";
import { EditOutlined, DeleteFilled, PlusOutlined, MinusCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import {
  Form,
  Input,
  Button,
  Radio,
  Select,
  TimePicker,
  InputNumber,
  message,
  Table,
  Modal,
  Grid,
  Space
} from 'antd';
import { useNavigate } from 'react-router';
import { setToken } from '../authentication/tokens';
import {useEffect} from "react"
const VendorDashboard = () => {
	const [usertype, setUserType] = useState("buyer");
    const navigate = useNavigate();
    const [foodarray, setFoodArray] = useState(null);
    const [form] = Form.useForm();
    const [showingModal, setVisibility]  = useState(false);
    const [vendorid, setVendorId] = useState(""); 
    useEffect(async() => {
        let decodedtoken = await axios.post("/user/info");
        let vendor = await axios.post("/user/profile");
        setVendorId(vendor.data._id);
    });
    const submit = async (values) => {
        let result = {...values, canteen: vendorid};
        if (!result.toppings) result = {...result, toppings: []}
        if (!result.tags) result = {...result, tags: []}
        let response = await axios.post("/food/register", result);
        if (response.data.status === 1) {
            message.error(response.data.error);
        }
    };
    const toggleForm = () => {
        if (showingModal === false) setVisibility(true);
        else setVisibility(false);
    }
    return (
        <>
            <Button onClick={toggleForm}>
                Add Food Item
            </Button>
            <Modal visible={showingModal} title="Add Food Item" onCancel={toggleForm} okText="Create item" 
            onOk={() =>
                form
                .validateFields()
                .then((values) => {
                    form.resetFields();
                    submit(values)        
                })
                .catch((err) =>{
                    console.log(err);
                })
            }>
                <Form
                form={form}
                labelCol={{
                    span: 6,
                }}
                wrapperCol={{
                    span: 14,
                }}
                layout="horizontal"
                initialValues={{
                    size: "default",
                    non_veg: false 
                }}
                requiredMark={true}

                >
                    <br/>
                    <Form.Item label="Item name" required name="item_name" rules={[{required: true, message: "Enter a name for the food item"}]} >
                        <Input placeholder="Name"/>
                    </Form.Item>
                    <Form.Item label="Price" required name="price" 
                    rules={[{required: true, message: "Enter the price"}]}>
                            <InputNumber placeholder="Price"/>
                    </Form.Item>
                    <Form.Item label="Veg/Non-veg" name="non_veg">
                        <Radio.Group  value={false}>
                            <Radio.Button value={false}>Veg</Radio.Button>
                            <Radio.Button value={true}>Non-Veg</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item name='tags' label="Tags">
                                <Select mode='multiple' placeholder="Tags">
                                    <Select.Option key="COLD">Cold</Select.Option>
                                    <Select.Option key="HOT">Hot</Select.Option>
                                    <Select.Option key="SWEET">Sweet</Select.Option>
                                    <Select.Option key="SPICY">Spicy</Select.Option>
                                    <Select.Option key="DRINK">Drink</Select.Option>
                                    <Select.Option key="MEAL">Meal</Select.Option>
                                    <Select.Option key="SNACK">Snack</Select.Option>
                                </Select>
                    </Form.Item>
                    <Form.List name="toppings">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'name']}
                                            rules={[{ required: true, message: 'Enter a name for the addon' }]}
                                            wrapperCol={{
                                                offset: 6,
                                                span: 14,
                                            }}
                                        >
                                            <Input placeholder="Addon name" />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'price']}
                                            rules={[{ required: true, message: 'Enter the addon\'s price' }]}
                                        >
                                            <Input placeholder="Price" />
                                        </Form.Item>
                                        <DeleteFilled onClick={() => remove(name)} />
                                    </Space>
                                ))}
                                <Form.Item
                                wrapperCol={{
                                    offset: 4,
                                    span: 12,
                                }}>
                                    <Button type="dashed" onClick={() => add()} block>
                                        New Addon
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form>
            </Modal>
        </> 
    );
}
export default VendorDashboard;