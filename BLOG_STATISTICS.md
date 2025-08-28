# 실시간 블로그 통계 시스템 (Real-time Blog Statistics System)

## 🎯 개요 (Overview)

방문자, 포스팅, 블로그 운영일을 0으로 초기화하고 실시간으로 카운트하는 시스템이 구현되었습니다. 구독자 섹션은 제거되었습니다.

A real-time blog statistics system has been implemented that resets visitors, posts, and blog operation days to 0 and tracks them in real-time. The subscriber section has been removed.

## 📊 구현된 기능 (Implemented Features)

### 1. 실시간 통계 추적 (Real-time Statistics Tracking)
- **총 방문자 (Total Visitors)**: 세션 기반 고유 방문자 추적
- **총 포스팅 (Total Posts)**: 발행된 포스트 실시간 카운팅
- **블로그 운영일 (Blog Operation Days)**: 시작일부터 자동 계산

### 2. 방문자 추적 시스템 (Visitor Tracking System)
- 브라우저 세션 기반 고유 방문자 식별
- localStorage를 통한 세션 관리
- 페이지 방문 시 자동 카운팅
- 탭 전환 시에도 방문자 추적

### 3. 포스트 카운팅 (Post Counting)
- 'published' 상태의 포스트만 카운팅
- 실시간 Supabase 구독으로 즉시 업데이트
- 포스트 발행/삭제 시 자동 반영

### 4. 블로그 운영일 계산 (Blog Operation Days)
- 시작일: 매일 자동으로 초기화되어 0일부터 시작
- 현재 날짜까지 자동 계산
- 매일 자동 업데이트

## 🔧 관리자 기능 (Admin Features)

### PostInteractionManager 컴포넌트에서 제공:

1. **포스트 카운터 초기화**
   - 모든 포스트의 조회수와 좋아요 수를 0으로 리셋

2. **블로그 통계 전체 초기화** (새로 추가)
   - 방문자 수를 0으로 리셋
   - 포스트 조회수와 좋아요 수를 0으로 리셋
   - 세션 데이터 초기화

## 📱 사용자 인터페이스 (User Interface)

### StatsSection 컴포넌트
- 3개 컬럼 레이아웃 (구독자 섹션 제거)
- 카운트업 애니메이션 효과
- 실시간 데이터 반영
- 로딩 상태 표시

## 🛠️ 기술 구현 (Technical Implementation)

### 파일 구조:
```
src/
├── hooks/
│   ├── useBlogStatistics.tsx     # 핵심 통계 훅
│   └── useProfileStats.tsx       # 프로필 통계 (통합됨)
├── components/
│   ├── StatsSection.tsx          # 메인 통계 섹션
│   └── admin/
│       └── PostInteractionManager.tsx  # 관리자 패널
```

### 핵심 기능:
1. **localStorage 기반 방문자 추적**
   - 세션 ID 생성 및 관리
   - 고유 방문자 카운팅

2. **Supabase 실시간 구독**
   - 포스트 변경 사항 실시간 감지
   - 자동 통계 업데이트

3. **관리자 리셋 기능**
   - 모든 통계를 0으로 초기화
   - 세션 데이터 클리어

## 🚀 사용 방법 (Usage)

### 일반 사용자:
1. 웹사이트 방문 시 자동으로 방문자 카운팅
2. 실시간으로 업데이트되는 통계 확인

### 관리자:
1. 관리자 패널에서 "블로그 통계 전체 초기화" 버튼 클릭
2. 모든 카운터가 0으로 리셋됨
3. 새로운 방문자부터 다시 카운팅 시작

## ⚙️ 설정 변경 (Configuration)

### 블로그 시작일 변경:
`src/hooks/useBlogStatistics.tsx` 파일의 `BLOG_START_DATE` 상수는 현재 동적으로 오늘 날짜로 설정되어 있습니다.

```typescript
const BLOG_START_DATE = new Date().toISOString().split('T')[0]; // 오늘 날짜로 자동 설정
```

만약 고정된 날짜로 변경하고 싶다면:
```typescript
const BLOG_START_DATE = '2024-01-01'; // 원하는 날짜로 변경
```

## 🔍 문제 해결 (Troubleshooting)

### 방문자 수가 증가하지 않는 경우:
1. 브라우저의 localStorage가 활성화되어 있는지 확인
2. 시크릿 모드에서는 세션이 개별적으로 관리됨

### 포스트 수가 업데이트되지 않는 경우:
1. 포스트 상태가 'published'인지 확인
2. Supabase 연결 상태 확인

## 🎯 향후 개선 사항 (Future Enhancements)

1. **서버사이드 방문자 추적**: IP 기반 더 정확한 추적
2. **일별/월별 통계**: 상세한 분석 데이터
3. **지역별 방문자 분석**: 국가/도시별 통계
4. **실시간 차트**: 시각적 통계 표시

---

✅ **완료된 요구사항:**
- ✅ 방문자, 포스팅, 블로그 운영일 0으로 초기화
- ✅ 실시간 카운팅 시스템 구현
- ✅ 구독자 부분 삭제
- ✅ 관리자 리셋 기능 추가