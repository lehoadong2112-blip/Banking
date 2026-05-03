package back_end_Group_13.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import back_end_Group_13.Domain.Trans;

@Repository
public interface TransRepository extends JpaRepository<Trans, Long> {
    List<Trans> findBySenderIdOrReceiverIdOrderByTransactionDateDesc(Integer senderId, Integer receiverId);
}
