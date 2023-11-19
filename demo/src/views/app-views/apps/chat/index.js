import React from 'react'
import InnerAppLayout from 'layouts/inner-app-layout';
import ChatContent from './ChatContent';
import ChatMenu from './ChatMenu';

const Chat = props => {
	return (
		<div className="chat">
			<InnerAppLayout 
				mainContent={<ChatContent {...props}/>}
				sideContentWidth={0}
				sideContentGutter={false}
				border
			/>
		</div>
	)
}

export default Chat
