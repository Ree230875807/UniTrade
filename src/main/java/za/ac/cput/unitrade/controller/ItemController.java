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