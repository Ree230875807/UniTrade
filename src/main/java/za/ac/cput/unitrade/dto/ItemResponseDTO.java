package za.ac.cput.unitrade.dto;

import lombok.Builder;
import lombok.Value;
import java.math.BigDecimal;

@Value
@Builder
public class ItemResponseDTO {
    Long id;
    String title;
    String description;
    String category;
    String condition;
    BigDecimal price;
    String imageUrl;
    String location;
    Long sellerId;
    String sellerName;
    String sellerEmail;
    String sellerUniversityEmail;
    boolean verifiedStudent;
}