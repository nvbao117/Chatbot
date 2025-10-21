"""add update triggers and views

Revision ID: b667894ea18c
Revises: d9169e401eb2
Create Date: 2025-10-21 13:25:41.064395

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b667894ea18c'
down_revision: Union[str, Sequence[str], None] = 'd9169e401eb2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
     # 1) Function cập nhật updated_at
    op.execute(
        """
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        """
    )

    # 2) Các trigger sử dụng function trên
    triggers = [
        ("update_users_updated_at", "users"),
        ("update_subjects_updated_at", "subjects"),
        ("update_conversations_updated_at", "conversations"),
        ("update_quiz_questions_updated_at", "quiz_questions"),
        ("update_learning_progress_updated_at", "learning_progress"),
        ("update_system_settings_updated_at", "system_settings"),
    ]

    for trigger_name, table_name in triggers:
        op.execute(
            f"""
            CREATE TRIGGER {trigger_name}
            BEFORE UPDATE ON {table_name}
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
            """
        )

    # 3) View thống kê người dùng (ví dụ)
    op.execute(
        """
        CREATE OR REPLACE VIEW user_statistics AS
        SELECT 
            u.user_id,
            u.username,
            u.full_name,
            COUNT(DISTINCT c.conversation_id) AS total_conversations,
            COUNT(DISTINCT qs.session_id) AS total_quiz_sessions,
            COALESCE(AVG(qs.accuracy_percentage), 0) AS avg_accuracy,
            COALESCE(SUM(lp.total_time_minutes), 0) AS total_study_time,
            COUNT(DISTINCT ua.achievement_id) AS total_achievements
        FROM users u
        LEFT JOIN conversations c ON u.user_id = c.user_id
        LEFT JOIN quiz_sessions qs ON u.user_id = qs.user_id AND qs.status = 'completed'
        LEFT JOIN learning_progress lp ON u.user_id = lp.user_id
        LEFT JOIN user_achievements ua ON u.user_id = ua.user_id
        WHERE u.is_active = TRUE
        GROUP BY u.user_id, u.username, u.full_name;
        """
    )

    # 4) View chi tiết tiến độ (ví dụ)
    op.execute(
        """
        CREATE OR REPLACE VIEW detailed_learning_progress AS
        SELECT 
            lp.user_id,
            u.username,
            s.subject_name,
            t.topic_name,
            lp.progress_percentage,
            lp.total_time_minutes,
            lp.lessons_completed,
            lp.quizzes_completed,
            lp.average_score,
            lp.last_activity_at
        FROM learning_progress lp
        JOIN users u ON lp.user_id = u.user_id
        JOIN subjects s ON lp.subject_id = s.subject_id
        LEFT JOIN topics t ON lp.topic_id = t.topic_id
        WHERE u.is_active = TRUE AND s.is_active = TRUE;
        """
    )



def downgrade() -> None:
    # Xóa view trước
    op.execute("DROP VIEW IF EXISTS detailed_learning_progress;")
    op.execute("DROP VIEW IF EXISTS user_statistics;")

    # Xóa trigger theo thứ tự ngược lại
    triggers = [
        ("update_system_settings_updated_at", "system_settings"),
        ("update_learning_progress_updated_at", "learning_progress"),
        ("update_quiz_questions_updated_at", "quiz_questions"),
        ("update_conversations_updated_at", "conversations"),
        ("update_subjects_updated_at", "subjects"),
        ("update_users_updated_at", "users"),
    ]
    for trigger_name, table_name in triggers:
        op.execute(
            f"DROP TRIGGER IF EXISTS {trigger_name} ON {table_name};"
        )

    # Cuối cùng xóa function
    op.execute("DROP FUNCTION IF EXISTS update_updated_at_column;")
