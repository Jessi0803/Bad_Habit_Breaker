// Simplified Clerk Authentication for Chrome Extension
// 使用 Clerk JavaScript SDK 的簡化版本

// Clerk 配置
const CLERK_CONFIG = {
  publishableKey: 'pk_test_YWJzb2x1dGUtcm9kZW50LTY0LmNsZXJrLmFjY291bnRzLmRldiQ',
  frontendApi: 'absolute-rodent-64.clerk.accounts.dev'
};

class SimpleClerkAuth {
  constructor() {
    this.session = null;
    this.user = null;
    this.init();
  }
  
  async init() {
    // 從 storage 載入已存在的 session
    const data = await chrome.storage.local.get(['clerk_session', 'clerk_user']);
    if (data.clerk_session && data.clerk_user) {
      this.session = data.clerk_session;
      this.user = data.clerk_user;
    }
  }
  
  isSignedIn() {
    return !!(this.session && this.user);
  }
  
  getUser() {
    return this.user;
  }
  
  /**
   * 使用 Clerk Client API 登入
   * 參考：https://clerk.com/docs/reference/frontend-api
   */
  async signIn(email, password) {
    try {
      console.log('🔐 Attempting Clerk sign in...');
      console.log('   API:', `https://${CLERK_CONFIG.frontendApi}/v1/client/sign_ins`);
      
      // Step 1: 創建 sign in attempt
      const createResponse = await fetch(`https://${CLERK_CONFIG.frontendApi}/v1/client/sign_ins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CLERK_CONFIG.publishableKey}`
        },
        body: JSON.stringify({
          identifier: email
        })
      });
      
      console.log('   Create response status:', createResponse.status);
      
      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        console.error('   Create error:', errorText);
        throw new Error(`Create sign in failed: ${createResponse.status}`);
      }
      
      const createData = await createResponse.json();
      console.log('   Sign in ID:', createData.response?.id);
      
      // Step 2: 使用 password 完成登入
      const attemptResponse = await fetch(
        `https://${CLERK_CONFIG.frontendApi}/v1/client/sign_ins/${createData.response.id}/attempt_first_factor`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CLERK_CONFIG.publishableKey}`
          },
          body: JSON.stringify({
            strategy: 'password',
            password: password
          })
        }
      );
      
      console.log('   Attempt response status:', attemptResponse.status);
      
      if (!attemptResponse.ok) {
        const errorText = await attemptResponse.text();
        console.error('   Attempt error:', errorText);
        throw new Error(`Password verification failed: ${attemptResponse.status}`);
      }
      
      const attemptData = await attemptResponse.json();
      console.log('   Login successful!');
      
      // 提取用戶和 session 資訊
      if (attemptData.response && attemptData.response.created_session_id) {
        const sessionId = attemptData.response.created_session_id;
        const userData = attemptData.client?.sessions?.find(s => s.id === sessionId);
        
        if (userData && userData.user) {
          this.user = userData.user;
          this.session = { id: sessionId, ...userData };
          
          // 儲存到 storage
          await chrome.storage.local.set({
            clerk_session: this.session,
            clerk_user: this.user
          });
          
          await chrome.storage.sync.set({
            userEmail: this.user.primary_email_address?.email_address || email,
            clerkUserId: this.user.id,
            userName: this.user.first_name || email.split('@')[0]
          });
          
          console.log('✅ Clerk authentication successful!');
          return this.user;
        }
      }
      
      throw new Error('Could not extract user data from response');
      
    } catch (error) {
      console.error('❌ Clerk sign in error:', error);
      console.error('   Error details:', error.message);
      throw error;
    }
  }
  
  async signOut() {
    this.session = null;
    this.user = null;
    await chrome.storage.local.remove(['clerk_session', 'clerk_user']);
    await chrome.storage.sync.remove(['userEmail', 'clerkUserId', 'userName']);
    console.log('✅ Signed out');
  }
}

// 導出單例
const clerkAuthSimple = new SimpleClerkAuth();

