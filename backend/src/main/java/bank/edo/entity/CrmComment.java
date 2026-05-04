package bank.edo.entity;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name="crm_comments") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CrmComment {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="appeal_id",nullable=false) private Appeal appeal;
    @Column(nullable=false,length=200) private String author;
    @Column(name="comment_date",length=50) private String commentDate;
    @Column(columnDefinition="TEXT",nullable=false) private String text;
}