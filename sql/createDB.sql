-- Kích hoạt các extension cần thiết
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

CREATE TABLE users(
	user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	username VARCHAR(50) UNIQUE NOT NULL , 
	email VARCHAR(100) UNIQUE NOT NULL , 
	password_hash VARCHAR(255) NOT NULL , 
	full_name VARCHAR(100) NOT NULL ,
	avatar_url TEXT , 
	date_of_birth DATE , 
	learning_level VARCHAR(20) DEFAULT 'Beginner'
		CHECK (learning_level IN ('Beginner', 'Intermediate', 'Advanced')),
	preferred_language VARCHAR(10) DEFAULT 'vi' , 
	timezone VARCHAR(50) DEFAULT 'Asia/Ho_Chi_Minh' , 
	is_active BOOLEAN DEFAULT TRUE ,
	is_premium BOOLEAN DEFAULT FALSE , 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, 
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
); 
-- Indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = TRUE;
-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- SUBJECT -- 
CREATE TABLE subjects(
	subject_id SERIAL PRIMARY KEY ,
	subject_name VARCHAR(100) UNIQUE NOT NULL , 
	subject_code VARCHAR(20) UNIQUE NOT NULL , 
	icon VARCHAR(10) NOT NULL , 
	description TEXT , 
	difficulty_level VARCHAR(20) DEFAULT 'Medium' 
        CHECK (difficulty_level IN ('Easy', 'Medium', 'Hard')), 
	estimated_hours INTEGER DEFAULT 0 , 
	is_active BOOLEAN DEFAULT TRUE,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_subjects_name ON subjects(subject_name);
CREATE INDEX idx_subjects_difficulty ON subjects(difficulty_level);
CREATE INDEX idx_subjects_active ON subjects(is_active) WHERE is_active = TRUE;

-- Trigger
CREATE TRIGGER update_subjects_updated_at 
    BEFORE UPDATE ON subjects 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


CREATE TABLE topics (
    topic_id SERIAL PRIMARY KEY,
    subject_id INTEGER NOT NULL REFERENCES subjects(subject_id) ON DELETE CASCADE,
    topic_name VARCHAR(200) NOT NULL,
    topic_description TEXT,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Indexes
CREATE INDEX idx_topics_subject ON topics(subject_id);
CREATE INDEX idx_topics_subject_name ON topics(subject_id, topic_name);
CREATE INDEX idx_topics_order ON topics(order_index);
CREATE INDEX idx_topics_active ON topics(is_active) WHERE is_active = TRUE;

CREATE TABLE conversations (
    conversation_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    subject_id INTEGER NOT NULL REFERENCES subjects(subject_id) ON DELETE CASCADE,
    title VARCHAR(200),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_conversations_user ON conversations(user_id, created_at DESC);
CREATE INDEX idx_conversations_subject ON conversations(subject_id, created_at DESC);
CREATE INDEX idx_conversations_active ON conversations(is_active) WHERE is_active = TRUE;

-- Trigger
CREATE TRIGGER update_conversations_updated_at 
    BEFORE UPDATE ON conversations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 

CREATE TABLE messages(
	message_id UUID PRIMARY KEY DEFAULT uuid_generate_v4() , 
	conversation_id UUID NOT NULL REFERENCES conversations(conversation_id) ON DELETE CASCADE , 
	user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, 
	role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')), 
	content TEXT NOT NULL ,
	message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text','file','image','audio')),
	file_info JSONB ,
	tokens_used INTEGER DEFAULT 0 ,
	processing_time_ms INTEGER DEFAULT 0 , 
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);
CREATE INDEX idx_messages_user ON messages(user_id, created_at DESC);
CREATE INDEX idx_messages_role ON messages(role);
CREATE INDEX idx_messages_type ON messages(message_type);
-- GIN index for JSONB
CREATE INDEX idx_messages_file_info ON messages USING GIN (file_info);

CREATE TABLE quiz_questions (
	question_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	subject_id INTEGER NOT NULL REFERENCES subjects(subject_id) ON DELETE CASCADE,
	topic_id INTEGER REFERENCES topics(topic_id) ON DELETE SET NULL,
 	question_text TEXT NOT NULL,
	question_type VARCHAR(20) DEFAULT 'multiple_choice' 
        CHECK (question_type IN ('multiple_choice', 'fill_blank', 'true_false', 'essay')),
	difficulty_level VARCHAR(20) DEFAULT 'Medium' 
        CHECK (difficulty_level IN ('Easy', 'Medium', 'Hard')),
	points INTEGER DEFAULT 1,
    time_limit_seconds INTEGER DEFAULT 60,
	explanation TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_quiz_questions_subject ON quiz_questions(subject_id, difficulty_level);
CREATE INDEX idx_quiz_questions_topic ON quiz_questions(topic_id);
CREATE INDEX idx_quiz_questions_type ON quiz_questions(question_type);
CREATE INDEX idx_quiz_questions_active ON quiz_questions(is_active) WHERE is_active = TRUE; 
-- Full-text search index
CREATE INDEX idx_quiz_questions_search ON quiz_questions USING GIN (to_tsvector('english', question_text));
-- Trigger
CREATE TRIGGER update_quiz_questions_updated_at 
    BEFORE UPDATE ON quiz_questions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 


CREATE TABLE quiz_options (
    option_id SERIAL PRIMARY KEY,
    question_id UUID NOT NULL REFERENCES quiz_questions(question_id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    option_order INTEGER NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_quiz_options_question ON quiz_options(question_id, option_order);
CREATE INDEX idx_quiz_options_correct ON quiz_options(is_correct) WHERE is_correct = TRUE; 

CREATE TABLE quiz_sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    subject_id INTEGER NOT NULL REFERENCES subjects(subject_id) ON DELETE CASCADE,
    topic_id INTEGER REFERENCES topics(topic_id) ON DELETE SET NULL,
    session_name VARCHAR(200),
    total_questions INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    total_score DECIMAL(5,2) DEFAULT 0.00,
    accuracy_percentage DECIMAL(5,2) DEFAULT 0.00,
    time_spent_seconds INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'in_progress' 
        CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_quiz_sessions_user ON quiz_sessions(user_id, started_at DESC);
CREATE INDEX idx_quiz_sessions_subject ON quiz_sessions(subject_id, started_at DESC);
CREATE INDEX idx_quiz_sessions_status ON quiz_sessions(status);
CREATE INDEX idx_quiz_sessions_completed ON quiz_sessions(completed_at) WHERE completed_at IS NOT NULL; 


CREATE TABLE quiz_answers (
    answer_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES quiz_sessions(session_id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES quiz_questions(question_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    selected_option_id INTEGER REFERENCES quiz_options(option_id) ON DELETE SET NULL,
    user_answer_text TEXT,
    is_correct BOOLEAN DEFAULT FALSE,
    points_earned DECIMAL(3,2) DEFAULT 0.00,
    time_spent_seconds INTEGER DEFAULT 0,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_quiz_answers_session ON quiz_answers(session_id, answered_at);
CREATE INDEX idx_quiz_answers_user ON quiz_answers(user_id, answered_at DESC);
CREATE INDEX idx_quiz_answers_question ON quiz_answers(question_id);
CREATE INDEX idx_quiz_answers_correct ON quiz_answers(is_correct);


CREATE TABLE learning_progress (
    progress_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    subject_id INTEGER NOT NULL REFERENCES subjects(subject_id) ON DELETE CASCADE,
    topic_id INTEGER REFERENCES topics(topic_id) ON DELETE CASCADE,
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    total_time_minutes INTEGER DEFAULT 0,
    lessons_completed INTEGER DEFAULT 0,
    quizzes_completed INTEGER DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0.00,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Unique constraint
    CONSTRAINT unique_user_subject_topic UNIQUE (user_id, subject_id, topic_id)
);

-- Indexes
CREATE INDEX idx_learning_progress_user ON learning_progress(user_id, last_activity_at DESC);
CREATE INDEX idx_learning_progress_subject ON learning_progress(subject_id, progress_percentage DESC);
CREATE INDEX idx_learning_progress_topic ON learning_progress(topic_id, progress_percentage DESC);

-- Trigger
CREATE TRIGGER update_learning_progress_updated_at 
    BEFORE UPDATE ON learning_progress 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 


CREATE TABLE achievements (
    achievement_id SERIAL PRIMARY KEY,
    achievement_name VARCHAR(100) NOT NULL,
    achievement_description TEXT,
    icon VARCHAR(10),
    category VARCHAR(20) DEFAULT 'learning' 
        CHECK (category IN ('learning', 'quiz', 'streak', 'social')),
    points_required INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_achievements_category ON achievements(category);
CREATE INDEX idx_achievements_points ON achievements(points_required);
CREATE INDEX idx_achievements_active ON achievements(is_active) WHERE is_active = TRUE;

CREATE TABLE user_achievements (
    user_achievement_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    achievement_id INTEGER NOT NULL REFERENCES achievements(achievement_id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    points_earned INTEGER DEFAULT 0,
    
    -- Unique constraint
    CONSTRAINT unique_user_achievement UNIQUE (user_id, achievement_id)
);

-- Indexes
CREATE INDEX idx_user_achievements_user ON user_achievements(user_id, earned_at DESC);
CREATE INDEX idx_user_achievements_achievement ON user_achievements(achievement_id); 


CREATE TABLE uploaded_files (
    file_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    conversation_id UUID REFERENCES conversations(conversation_id) ON DELETE SET NULL,
    original_filename VARCHAR(255) NOT NULL,
    stored_filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    file_path TEXT NOT NULL,
    processing_status VARCHAR(20) DEFAULT 'pending' 
        CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
    extracted_text TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_uploaded_files_user ON uploaded_files(user_id, created_at DESC);
CREATE INDEX idx_uploaded_files_type ON uploaded_files(file_type);
CREATE INDEX idx_uploaded_files_status ON uploaded_files(processing_status);
CREATE INDEX idx_uploaded_files_metadata ON uploaded_files USING GIN (metadata); 


CREATE TABLE activity_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    activity_type VARCHAR(20) NOT NULL 
        CHECK (activity_type IN ('login', 'logout', 'chat', 'quiz', 'file_upload', 'progress_update')),
    activity_description TEXT,
    subject_id INTEGER REFERENCES subjects(subject_id) ON DELETE SET NULL,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id, created_at DESC);
CREATE INDEX idx_activity_logs_type ON activity_logs(activity_type);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX idx_activity_logs_metadata ON activity_logs USING GIN (metadata); 


CREATE TABLE system_settings (
    setting_id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(20) DEFAULT 'string' 
        CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_system_settings_key ON system_settings(setting_key);
CREATE INDEX idx_system_settings_public ON system_settings(is_public) WHERE is_public = TRUE;

-- Trigger
CREATE TRIGGER update_system_settings_updated_at 
    BEFORE UPDATE ON system_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 


CREATE OR REPLACE FUNCTION create_quiz_session(
    p_user_id UUID,
    p_subject_id INTEGER,
    p_topic_id INTEGER DEFAULT NULL,
    p_question_count INTEGER DEFAULT 10
)
RETURNS UUID AS $$
DECLARE
    v_session_id UUID;
    v_questions_count INTEGER;
BEGIN
    -- Tạo session mới
    INSERT INTO quiz_sessions (user_id, subject_id, topic_id, total_questions)
    VALUES (p_user_id, p_subject_id, p_topic_id, p_question_count)
    RETURNING session_id INTO v_session_id;
    
    -- Đếm số câu hỏi có sẵn
    SELECT COUNT(*) INTO v_questions_count
    FROM quiz_questions 
    WHERE subject_id = p_subject_id 
    AND (p_topic_id IS NULL OR topic_id = p_topic_id)
    AND is_active = TRUE;
    
    -- Cập nhật số câu hỏi thực tế
    UPDATE quiz_sessions 
    SET total_questions = LEAST(p_question_count, v_questions_count)
    WHERE session_id = v_session_id;
    
    RETURN v_session_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION update_learning_progress(
    p_user_id UUID,
    p_subject_id INTEGER,
    p_topic_id INTEGER DEFAULT NULL,
    p_time_minutes INTEGER DEFAULT 0,
    p_quiz_score DECIMAL DEFAULT 0
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO learning_progress 
    (user_id, subject_id, topic_id, total_time_minutes, average_score, last_activity_at)
    VALUES (p_user_id, p_subject_id, p_topic_id, p_time_minutes, p_quiz_score, CURRENT_TIMESTAMP)
    ON CONFLICT (user_id, subject_id, p_topic_id) 
    DO UPDATE SET
        total_time_minutes = learning_progress.total_time_minutes + p_time_minutes,
        average_score = (learning_progress.average_score + p_quiz_score) / 2,
        last_activity_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION search_quiz_questions(
    p_search_term TEXT,
    p_subject_id INTEGER DEFAULT NULL,
    p_difficulty VARCHAR DEFAULT NULL,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    question_id UUID,
    question_text TEXT,
    difficulty_level VARCHAR,
    points INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT qq.question_id, qq.question_text, qq.difficulty_level, qq.points
    FROM quiz_questions qq
    WHERE qq.is_active = TRUE
    AND (p_subject_id IS NULL OR qq.subject_id = p_subject_id)
    AND (p_difficulty IS NULL OR qq.difficulty_level = p_difficulty)
    AND (
        p_search_term IS NULL OR 
        to_tsvector('english', qq.question_text) @@ plainto_tsquery('english', p_search_term)
    )
    ORDER BY qq.created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

CREATE VIEW user_statistics AS
SELECT 
    u.user_id,
    u.username,
    u.full_name,
    COUNT(DISTINCT c.conversation_id) as total_conversations,
    COUNT(DISTINCT qs.session_id) as total_quiz_sessions,
    COALESCE(AVG(qs.accuracy_percentage), 0) as avg_accuracy,
    COALESCE(SUM(lp.total_time_minutes), 0) as total_study_time,
    COUNT(DISTINCT ua.achievement_id) as total_achievements
FROM users u
LEFT JOIN conversations c ON u.user_id = c.user_id
LEFT JOIN quiz_sessions qs ON u.user_id = qs.user_id AND qs.status = 'completed'
LEFT JOIN learning_progress lp ON u.user_id = lp.user_id
LEFT JOIN user_achievements ua ON u.user_id = ua.user_id
WHERE u.is_active = TRUE
GROUP BY u.user_id, u.username, u.full_name;


CREATE VIEW detailed_learning_progress AS
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