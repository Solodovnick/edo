package bank.edo.entity;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name="history_entries") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class HistoryEntry {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="appeal_id",nullable=false) private Appeal appeal;
    @Column(name="related_number",length=30) private String relatedNumber;
    @Column(name="related_date",length=20) private String relatedDate;
    @Column(name="related_status",length=100) private String relatedStatus;
}