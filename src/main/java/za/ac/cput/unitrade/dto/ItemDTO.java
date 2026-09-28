package za.ac.cput.unitrade.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ItemDTO {
	private String title;
	private String description;
	private String category;
	private String condition;
	private BigDecimal price;
	private String imageUrl;
	private String location;
	private Long sellerId;
}
