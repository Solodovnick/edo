package bank.edo.entity;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name="attachments") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Attachment {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="appeal_id",nullable=false) private Appeal appeal;
    @Column(nullable=false,length=500) private String name;
    @Column(name="attach_date",length=20) private String attachDate;
}