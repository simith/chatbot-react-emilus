import React, { useRef, useState, useEffect } from 'react'
import ChatData from "assets/data/chat.data.json"
import { Avatar, Divider, Input, Form, Button, Menu } from 'antd';
import { 
	FileOutlined, 
	SendOutlined, 
	PaperClipOutlined, 
	SmileOutlined, 
	AudioMutedOutlined,
	UserOutlined,
	DeleteOutlined
} from '@ant-design/icons';
import { Scrollbars } from 'react-custom-scrollbars-2';
import Flex from 'components/shared-components/Flex';
import EllipsisDropdown from 'components/shared-components/EllipsisDropdown'
import { useParams } from 'react-router-dom';
import axios from 'axios';

const menu = () => (
	<Menu>
		<Menu.Item key="0">
			<UserOutlined />
			<span>User Info</span>
		</Menu.Item>
		<Menu.Item key="1">
			<AudioMutedOutlined />
			<span>Mute Chat</span>
		</Menu.Item>
		<Menu.Divider />
		<Menu.Item key="3">
			<DeleteOutlined />
			<span>Delete Chat</span>
		</Menu.Item>
	</Menu>
);

const Conversation = (props) => {

	const formRef = useRef();
	const chatBodyRef = useRef();
	// Set default header. e.g, X-API-KEY
	axios.defaults.headers['X-API-KEY'] = '5e6Mz5hIij98kgyAPruyh2jQPanvEsWg6PVdOYr5';

	const params = useParams();

	const [ info, setInfo ] = useState({});
	const [ msgList, setMsgList ] = useState([]);

	

	const { id } = params

	const getUserId = () => {
		return parseInt(parseInt(id))
	}
	
	const getConversation = currentId => {
		const data = ChatData.filter(elm => elm.id === currentId)

		setInfo(data[0])
		setMsgList(data[0].msg)
	}

	const getMsgType = obj => {
		switch (obj.msgType) {
			case 'text':
				return <span>{obj.text}</span>
			case 'image':
				return <img src={obj.text} alt={obj.text} />
			case 'file':
				return (
				<Flex alignItems="center" className="msg-file">
					<FileOutlined className="font-size-md"/>
					<span className="ml-2 font-weight-semibold text-link pointer">
						<u>{obj.text}</u>
					</span>
				</Flex>
				)
			default:
				return null;
		}
	}


	/*useEffect(() => {
		const interval = setInterval(() => {
			scrollToBottom()
		}, 500);
		return () => clearInterval(interval);
	  }, []);*/

	const  getRandomInt = (max) => {
		return Math.floor(Math.random() * max);
	  }

	const scrollToBottom = () => {
		chatBodyRef.current?.scrollToBottom()
	}

	const onSend = values => {
		if (values.newMsg) {
			const newMsgData = {
				avatar: "",
				from: "me",
				msgType: "text",
				text: values.newMsg,
				time: "",
			};

			msgList.push(newMsgData)
				setMsgList([...msgList]);
				setTimeout(()=>{scrollToBottom() },100);

			var msg_body = {
				"msg-type": "text",
				"msg": values.newMsg,
				"sessionId": props.sessionId
			}

			axios.post('https://t1wr8cu7gf.execute-api.ap-southeast-2.amazonaws.com/prod/chat',
			           msg_body,
					   {
						headers: { 
							
							'Content-Type' : 'application/json' 
						}
					   }
					   )
				.then(res => {
					console.log(res.data)
					var msg = {
						"avatar": "/img/avatars/thumb-1.jpg",
						"text": res.data['chat_response'],
						"from": "opposite",
						"time": "",
						"msgType": "text"
					}
					msgList.push(msg)
					setMsgList([...msgList]);
			
					setTimeout(()=>{scrollToBottom() },100);
				})
				.catch(err => alert(err));

			formRef.current.setFieldsValue({
				newMsg: ''
			});
			
			
		}
	};
	
	const emptyClick = (e) => {
    	e.preventDefault();
	};

	useEffect(() => {
		getConversation(getUserId())
		scrollToBottom()
	}, [id])
	
	const chatContentHeader = name => (
		<div className="chat-content-header">
			<h4 className="mb-0">{name}</h4>
			<div>
				<EllipsisDropdown menu={menu}/>
			</div>
		</div>
	)

	const chatContentBody = (props, id) => (
		<div className="chat-content-body">
			<Scrollbars ref={chatBodyRef} autoHide>
				{
					props.map((elm, i) => (
						<div 
							key={`msg-${id}-${i}`} 
							className={`msg ${elm.msgType === 'date'? 'datetime' : ''} ${elm.from === 'opposite'? 'msg-recipient' : elm.from === 'me'? 'msg-sent' : ''}`}
						>
							{
								elm.avatar? 
								<div className="mr-2">
									<Avatar src={elm.avatar} />
								</div>
								:
								null
							}
							{
								elm.text?
								<div className={`bubble ${!elm.avatar? 'ml-5' : ''}`}>
									<div className="bubble-wrapper">
										{getMsgType(elm)}
									</div>
								</div>
								:
								null
							}
							{
								elm.msgType === 'date'?
								<Divider>{elm.time}</Divider>
								: 
								null
							}
						</div>
					))
				}
			</Scrollbars>
		</div>
	)

	const chatContentFooter = () => (
		<div className="chat-content-footer">
			<Form name="msgInput" ref={formRef} onFinish={onSend} className="w-100">
				<Form.Item name="newMsg" className="mb-0">
					<Input 
						autoComplete="off" 
						placeholder="Type a message..."
						suffix={
							<div className="d-flex align-items-center">
								<a href="/#"  className="text-dark font-size-lg mr-3" onClick={emptyClick}>
									<SmileOutlined />
								</a>
								<a href="/#" className="text-dark font-size-lg mr-3" onClick={emptyClick}>
									<PaperClipOutlined />
								</a>
								<Button shape="circle" type="primary" size="small" onClick={onSend} htmlType="submit">
									<SendOutlined />
								</Button>
							</div>
						}
					/>
				</Form.Item>
			</Form>
		</div>
	)

	return (
		<div className="chat-content">
				{chatContentHeader(info.name)}
				{chatContentBody(msgList, params.id)}
				{chatContentFooter()}
			</div>
	)
}

export default Conversation
