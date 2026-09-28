package za.ac.cput.unitrade.dto;

import lombok.Data;

@Data
public class ReportDTO {
    private Long itemId;
    private Long reporterId;
    private String reason;
}
