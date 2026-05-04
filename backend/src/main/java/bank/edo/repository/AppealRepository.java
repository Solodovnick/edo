package bank.edo.repository;
import bank.edo.entity.Appeal;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.*;
@Repository
public interface AppealRepository extends JpaRepository<Appeal, UUID> {
    Optional<Appeal> findByNumber(String number);
    boolean existsByNumber(String number);
    Page<Appeal> findByStatusIgnoreCase(String status, Pageable pageable);
    Page<Appeal> findByApplicantNameContainingIgnoreCaseOrOrganizationNameContainingIgnoreCaseOrNumberContainingIgnoreCase(
        String name, String org, String number, Pageable pageable);
}