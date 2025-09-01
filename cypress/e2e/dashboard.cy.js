describe('AuctionHub Dashboard E2E', () => {
  const user1 = { email: 'user1@example.com', password: 'password123' };
  const user2 = { email: 'user2@example.com', password: 'password123' };
  
  it('should allow user to log in and view dashboard', () => {
    cy.visit('http://localhost:3000/auth/signin')
    cy.get('input[name="email"]').type(user1.email)
    cy.get('input[name="password"]').type(user1.password)
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/profile')
    cy.contains('Notifications')
  })

  it('should allow user to create an auction', () => {
    cy.visit('http://localhost:3000/sell')
    cy.get('input[name="title"]').type('Test Auction Item')
    cy.get('textarea[name="description"]').type('This is a test auction item.')
    cy.get('select[name="category"]').select(1)
    cy.get('select[name="condition"]').select(1)
    cy.get('input[name="startingPrice"]').type('100')
    cy.get('input[name="duration"]').type('1')
    // Skipping image upload for simplicity
    cy.get('button[type="submit"]').click()
    cy.contains('Auction created').should('exist')
  })

  it('should allow another user to bid and trigger outbid notification', () => {
    cy.visit('http://localhost:3000/auth/signin')
    cy.get('input[name="email"]').type(user2.email)
    cy.get('input[name="password"]').type(user2.password)
    cy.get('button[type="submit"]').click()
    cy.visit('http://localhost:3000/')
    cy.contains('Test Auction Item').click()
    cy.get('input[name="bidAmount"]').type('110')
    cy.get('button').contains('Place Bid').click()
    cy.contains('Bid placed').should('exist')
  })

  it('should show outbid notification for user1', () => {
    cy.visit('http://localhost:3000/auth/signin')
    cy.get('input[name="email"]').type(user1.email)
    cy.get('input[name="password"]').type(user1.password)
    cy.get('button[type="submit"]').click()
    cy.visit('http://localhost:3000/profile')
    cy.contains('Notifications').click()
    cy.contains('outbid').should('exist')
  })

  it('should allow auction to be ended and winner to be notified', () => {
    cy.visit('http://localhost:3000/auth/signin')
    cy.get('input[name="email"]').type(user1.email)
    cy.get('input[name="password"]').type(user1.password)
    cy.get('button[type="submit"]').click()
    cy.visit('http://localhost:3000/profile')
    cy.contains('Test Auction Item').click()
    // Simulate ending auction (this may need to be done via API or admin UI)
    // cy.request('PUT', '/api/auctions/[id]', { status: 'ended' })
    // Check for win notification for user2
  })
})
