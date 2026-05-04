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

    Page<Appeal> findByApplicantCategoryIgnoreCase(String category, Pageable pageable);

    @Query("SELECT a FROM Appeal a WHERE LOWER(a.applicantCategory) = LOWER(:category) AND " +
           "(LOWER(a.applicantName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(a.organizationName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(a.number) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Appeal> findByCategoryAndSearch(@Param("category") String category,
                                         @Param("search") String search,
                                         Pageable pageable);
}