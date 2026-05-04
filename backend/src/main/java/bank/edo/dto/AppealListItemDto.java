package bank.edo.dto;
import bank.edo.entity.Appeal;
import lombok.*;
import java.time.LocalDate;
import java.util.UUID;
@Data @Builder
public class AppealListItemDto {
    private UUID id;
    private String number;
    private LocalDate regDate;
    private LocalDate deadline;
    private String appealType;
    private String status;
    private String applicantCategory;
    private String applicantName;
    private String organizationName;
    private String responsible;
    private String priority;
    private Boolean requiresAttention;
    private Boolean requiresSignature;
    private String auditStatus;
    public static AppealListItemDto from(Appeal a) {
        return AppealListItemDto.builder().id(a.getId()).number(a.getNumber()).regDate(a.getRegDate())
            .deadline(a.getDeadline()).appealType(a.getAppealType()).status(a.getStatus())
            .applicantCategory(a.getApplicantCategory()).applicantName(a.getApplicantName())
            .organizationName(a.getOrganizationName()).responsible(a.getResponsible()).priority(a.getPriority())
            .requiresAttention(a.getRequiresAttention()).requiresSignature(a.getRequiresSignature())
            .auditStatus(a.getAuditStatus()).build();
    }
}