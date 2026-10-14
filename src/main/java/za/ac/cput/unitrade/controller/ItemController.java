package za.ac.cput.unitrade.controller;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.unitrade.dao.Item;
import za.ac.cput.unitrade.dao.User;
import za.ac.cput.unitrade.dto.ItemDTO;
import za.ac.cput.unitrade.dto.ItemResponseDTO;
import za.ac.cput.unitrade.repository.ItemRepository;
import za.ac.cput.unitrade.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/items")
public class ItemController {
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    @org.springframework.beans.factory.annotation.Autowired
    private za.ac.cput.unitrade.service.MessageService messageService;

    public ItemController(ItemRepository itemRepository, UserRepository userRepository) {
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<ItemResponseDTO>> getAvailableItems() {
        var items = itemRepository.findByStatus("AVAILABLE", PageRequest.of(0, 100, Sort.by(Sort.Direction.DESC, "createdAt")));
        return ResponseEntity.ok(items.map(this::toResponse).getContent());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getItem(@PathVariable Long id) {
        Optional<Item> item = itemRepository.findByIdAndStatus(id, "AVAILABLE");
        return item.map(value -> ResponseEntity.ok(toResponse(value)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createItem(@RequestBody ItemDTO dto) {
        if (dto.getSellerId() == null) return ResponseEntity.badRequest().body("A seller is required");
        User seller = userRepository.findById(dto.getSellerId()).orElse(null);
        if (seller == null) return ResponseEntity.badRequest().body("Seller not found");
        if (!seller.isVerified()) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only verified students can publish listings");

        Item item = Item.builder()
                .seller(seller)
                .title(dto.getTitle())
                .description(dto.getDescription())
                .category(dto.getCategory())
                .condition(dto.getCondition())
                .price(dto.getPrice())
                .imageUrl(dto.getImageUrl())
                .location(dto.getLocation())
                .status("AVAILABLE")
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(itemRepository.save(item)));
    }

    @PostMapping("/{id}/buy")
    public ResponseEntity<?> checkoutItem(
            @PathVariable Long id,
            @RequestParam Long buyerId,
            @RequestParam(defaultValue = "false") boolean simulateMessageFailure) {

        Optional<Item> itemOpt = itemRepository.findByIdAndStatus(id, "AVAILABLE");
        if (itemOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Item is not available or does not exist.");
        }

        Item item = itemOpt.get();
        User buyer = userRepository.findById(buyerId).orElse(null);
        if (buyer == null) {
            return ResponseEntity.badRequest().body("Buyer not found.");
        }

        // 1. Process primary transaction flow (Checkout)
        item.setStatus("SOLD");
        itemRepository.save(item);

        // 2. Secondary flow: Send notification message to seller
        try {
            if (simulateMessageFailure) {
                // Artificially block messaging API to simulate network error
                throw new RuntimeException("Simulated Network Error in Messaging API");
            }

            za.ac.cput.unitrade.dto.MessageDTO msgDTO = new za.ac.cput.unitrade.dto.MessageDTO();
            msgDTO.setSenderId(buyerId);
            msgDTO.setReceiverId(item.getSeller().getId());
            msgDTO.setContent("System Message: Your item '" + item.getTitle() + "' has been purchased by " + buyer.getFirstName() + "!");

            messageService.sendMessage(msgDTO);

        } catch (Exception e) {
            // Catch the failure silently! 
            // The primary transaction (checkout) is not broken by this secondary failure.
            System.err.println("SILENT FAILURE CAUGHT: Failed to send notification message - " + e.getMessage());
        }

        // 3. Return successful Order Confirmed regardless of notification success
        return ResponseEntity.ok("Order Confirmed! You have successfully purchased: " + item.getTitle());
    }

    private ItemResponseDTO toResponse(Item item) {
        User seller = item.getSeller();
        return ItemResponseDTO.builder()
                .id(item.getId())
                .title(item.getTitle())
                .description(item.getDescription())
                .category(item.getCategory())
                .condition(item.getCondition())
                .price(item.getPrice())
                .imageUrl(item.getImageUrl())
                .location(item.getLocation())
                .sellerId(seller.getId())
                .sellerName(seller.getFirstName() + " " + seller.getLastName())
                .sellerEmail(seller.getEmail())
                .sellerUniversityEmail(seller.getUniversityEmail())
                .verifiedStudent(seller.isVerified())
                .build();
    }
}