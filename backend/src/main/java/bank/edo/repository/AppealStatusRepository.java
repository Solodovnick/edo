package bank.edo.repository;
import bank.edo.entity.AppealStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface AppealStatusRepository extends JpaRepository<AppealStatus, String> {}