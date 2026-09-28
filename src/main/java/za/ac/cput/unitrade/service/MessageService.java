package za.ac.cput.unitrade.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.unitrade.dao.Message;
import za.ac.cput.unitrade.dao.User;
import za.ac.cput.unitrade.dto.MessageDTO;
import za.ac.cput.unitrade.repository.MessageRepository;
import za.ac.cput.unitrade.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    public Message sendMessage(MessageDTO messageDTO) {
        Optional<User> senderOpt = userRepository.findById(messageDTO.getSenderId());
        Optional<User> receiverOpt = userRepository.findById(messageDTO.getReceiverId());

        if (senderOpt.isEmpty() || receiverOpt.isEmpty()) {
            throw new RuntimeException("Sender or receiver not found");
        }

        Message message = new Message();
        message.setSender(senderOpt.get());
        message.setReceiver(receiverOpt.get());
        message.setContent(messageDTO.getContent());
        message.setTimestamp(LocalDateTime.now());

        return messageRepository.save(message);
    }

    public List<Message> getConversation(Long user1Id, Long user2Id) {
        return messageRepository.findConversation(user1Id, user2Id);
    }
}
