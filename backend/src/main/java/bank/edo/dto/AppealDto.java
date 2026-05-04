package bank.edo.dto;
import bank.edo.entity.*;
import lombok.*;
import java.time.*;
import java.util.*;
@Data @Builder
public class AppealDto {
    private UUID id; private String number; private LocalDate regDate; private LocalDate deadline;
    private String appealType; private String subcategory; private String status;
    private String applicantCategory; private String applicantName; private String organizationName;
    private String address; private String phone; private String email; private String cbs;
    private String appealCategory; private String appealSubcategory; private String content;
    private String solution; private String response; private String responsible;
    private String registrar; private String createdBy; private String auditStatus;
    private String priority; private Boolean requiresAttention; private Boolean requiresSignature;
    private LocalDateTime createdAt; private LocalDateTime updatedAt;
    private List<AttDto> attachments; private List<ComDto> crmComments; private List<HisDto> history;
    public static AppealDto from(Appeal a) {
        return AppealDto.builder().id(a.getId()).number(a.getNumber()).regDate(a.getRegDate())
            .deadline(a.getDeadline()).appealType(a.getAppealType()).subcategory(a.getSubcategory())
            .status(a.getStatus()).applicantCategory(a.getApplicantCategory()).applicantName(a.getApplicantName())
            .organizationName(a.getOrganizationName()).address(a.getAddress()).phone(a.getPhone())
            .email(a.getEmail()).cbs(a.getCbs()).appealCategory(a.getAppealCategory())
            .appealSubcategory(a.getAppealSubcategory()).content(a.getContent()).solution(a.getSolution())
            .response(a.getResponse()).responsible(a.getResponsible()).registrar(a.getRegistrar())
            .createdBy(a.getCreatedBy()).auditStatus(a.getAuditStatus()).priority(a.getPriority())
            .requiresAttention(a.getRequiresAttention()).requiresSignature(a.getRequiresSignature())
            .createdAt(a.getCreatedAt()).updatedAt(a.getUpdatedAt())
            .attachments(a.getAttachments().stream().map(AttDto::from).toList())
            .crmComments(a.getCrmComments().stream().map(ComDto::from).toList())
            .history(a.getHistory().stream().map(HisDto::from).toList()).build();
    }
    @Data @Builder public static class AttDto {
        private Long id; private String name; private String attachDate;
        static AttDto from(Attachment x) { return AttDto.builder().id(x.getId()).name(x.getName()).attachDate(x.getAttachDate()).build(); }
    }
    @Data @Builder public static class ComDto {
        private Long id; private String author; private String commentDate; private String text;
        static ComDto from(CrmComment x) { return ComDto.builder().id(x.getId()).author(x.getAuthor()).commentDate(x.getCommentDate()).text(x.getText()).build(); }
    }
    @Data @Builder public static class HisDto {
        private Long id; private String relatedNumber; private String relatedDate; private String relatedStatus;
        static HisDto from(HistoryEntry x) { return HisDto.builder().id(x.getId()).relatedNumber(x.getRelatedNumber()).relatedDate(x.getRelatedDate()).relatedStatus(x.getRelatedStatus()).build(); }
    }
}