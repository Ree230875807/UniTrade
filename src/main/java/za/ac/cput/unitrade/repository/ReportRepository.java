package za.ac.cput.unitrade.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.unitrade.dao.Report;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
}
