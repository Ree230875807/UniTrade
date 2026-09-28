package za.ac.cput.unitrade.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.unitrade.dao.Item;
import za.ac.cput.unitrade.dao.Report;
import za.ac.cput.unitrade.dao.User;
import za.ac.cput.unitrade.dto.ReportDTO;
import za.ac.cput.unitrade.repository.ItemRepository;
import za.ac.cput.unitrade.repository.ReportRepository;
import za.ac.cput.unitrade.repository.UserRepository;

import java.util.Optional;

@Service
public class ReportService {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    public Report createReport(ReportDTO reportDTO) {
        Optional<Item> itemOpt = itemRepository.findById(reportDTO.getItemId());
        Optional<User> reporterOpt = userRepository.findById(reportDTO.getReporterId());

        if (itemOpt.isEmpty() || reporterOpt.isEmpty()) {
            throw new RuntimeException("Item or reporter not found");
        }

        Report report = Report.builder()
                .item(itemOpt.get())
                .reporter(reporterOpt.get())
                .reason(reportDTO.getReason())
                .status("PENDING")
                .build();

        return reportRepository.save(report);
    }

    public Iterable<Report> getAllReports() {
        return reportRepository.findAll();
    }

    public Report resolveReport(Long reportId, String action) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        report.setStatus("RESOLVED");
        
        if ("REMOVE_ITEM".equals(action)) {
            Item item = report.getItem();
            item.setStatus("REMOVED");
            itemRepository.save(item);
        } else if ("BAN_USER".equals(action)) {
            User reporter = report.getItem().getSeller(); // Ban the seller of the item
            reporter.setBanned(true);
            userRepository.save(reporter);
            
            Item item = report.getItem();
            item.setStatus("REMOVED");
            itemRepository.save(item);
        }

        return reportRepository.save(report);
    }
}
