package bank.edo.entity;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name="appeal_statuses") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AppealStatus {
    @Id @Column(length=80) private String code;
    @Column(name="name_ru",nullable=false,length=100) private String nameRu;
    @Column(name="sort_order",nullable=false) private Integer sortOrder;
}