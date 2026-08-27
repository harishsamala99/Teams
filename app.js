// Core State Management
class LeagueState {
  constructor() {
    this.teams = [];
    this.fixtures = [];
    this.onChange = null;
    this.saveQueue = Promise.resolve();
    this.loadState();
  }

  loadState() {
    const dataVersion = 'blank-v1';
    if (localStorage.getItem('apex_data_version') !== dataVersion) {
      localStorage.removeItem('apex_teams');
      localStorage.removeItem('apex_fixtures');
      localStorage.setItem('apex_data_version', dataVersion);
    }

    const savedTeams = localStorage.getItem('apex_teams');
    const savedFixtures = localStorage.getItem('apex_fixtures');

    if (savedTeams && savedFixtures) {
      this.teams = JSON.parse(savedTeams);
      this.fixtures = JSON.parse(savedFixtures);
    } else {
      this.teams = [];
      this.fixtures = [];
      this.saveState();
    }

    this.syncFromServer();
  }

  saveState() {
    localStorage.setItem('apex_teams', JSON.stringify(this.teams));
    localStorage.setItem('apex_fixtures', JSON.stringify(this.fixtures));
    const stateSnapshot = JSON.stringify({ teams: this.teams, fixtures: this.fixtures });
    this.saveQueue = this.saveQueue
      .catch(() => {})
      .then(() => fetch('/api/state', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: stateSnapshot
      }))
      .catch(() => {});
  }

  async syncFromServer() {
    try {
      const response = await fetch('/api/state');
      if (!response.ok) return;

      const serverState = await response.json();
      const hasServerData = serverState.teams.length > 0 || serverState.fixtures.length > 0;
      const hasLocalData = this.teams.length > 0 || this.fixtures.length > 0;

      if (hasServerData || !hasLocalData) {
        this.teams = serverState.teams;
        this.fixtures = serverState.fixtures;
        localStorage.setItem('apex_teams', JSON.stringify(this.teams));
        localStorage.setItem('apex_fixtures', JSON.stringify(this.fixtures));
        if (this.onChange) this.onChange();
      } else {
        this.saveState();
      }
    } catch (error) {
      // Keep using local storage when the API is unavailable.
    }
  }

  resetState() {
    this.teams = [];
    this.fixtures = [];
    this.saveState();
  }

  // Helper ID generator
  generateId() {
    return Math.random().toString(36).substring(2, 9);
  }

  // Initial Mock Data setup
  initMockData() {
    this.teams = [
      {
        id: 't1',
        name: 'Vanguard FC',
        color: '#3b82f6', // blue
        emblem: 'VFC',
        players: [
          { id: 'p101', name: 'Marcus Sterling', number: 9, position: 'Forward' },
          { id: 'p102', name: 'Christian Pulis', number: 10, position: 'Midfielder' },
          { id: 'p103', name: 'Declan Rice', number: 4, position: 'Midfielder' },
          { id: 'p104', name: 'Virgil Stone', number: 5, position: 'Defender' },
          { id: 'p105', name: 'Alisson Becker', number: 1, position: 'Goalkeeper' }
        ]
      },
      {
        id: 't2',
        name: 'Phoenix Athletic',
        color: '#ef4444', // red
        emblem: 'PHX',
        players: [
          { id: 'p201', name: 'Erling Haaland', number: 9, position: 'Forward' },
          { id: 'p202', name: 'Kevin De Bruyne', number: 17, position: 'Midfielder' },
          { id: 'p203', name: 'Rodri Hernandez', number: 16, position: 'Midfielder' },
          { id: 'p204', name: 'Ruben Dias', number: 3, position: 'Defender' },
          { id: 'p205', name: 'Ederson Moraes', number: 31, position: 'Goalkeeper' }
        ]
      },
      {
        id: 't3',
        name: 'Emerald Rovers',
        color: '#10b981', // green
        emblem: 'ER',
        players: [
          { id: 'p301', name: 'Mohamed Salah', number: 11, position: 'Forward' },
          { id: 'p302', name: 'Luis Diaz', number: 7, position: 'Forward' },
          { id: 'p303', name: 'Alexis Mac', number: 10, position: 'Midfielder' },
          { id: 'p304', name: 'Trent Alexander', number: 66, position: 'Defender' },
          { id: 'p305', name: 'Kelleher Smith', number: 62, position: 'Goalkeeper' }
        ]
      },
      {
        id: 't4',
        name: 'Neon United',
        color: '#ec4899', // pink/magenta
        emblem: 'NU',
        players: [
          { id: 'p401', name: 'Kylian Mbappe', number: 7, position: 'Forward' },
          { id: 'p402', name: 'Jude Bellingham', number: 5, position: 'Midfielder' },
          { id: 'p403', name: 'Vinicius Jr', number: 11, position: 'Forward' },
          { id: 'p404', name: 'Antonio Rudiger', number: 22, position: 'Defender' },
          { id: 'p405', name: 'Thibaut Courtois', number: 1, position: 'Goalkeeper' }
        ]
      },
      {
        id: 't5',
        name: 'Horizon FC',
        color: '#f59e0b', // orange
        emblem: 'HFC',
        players: [
          { id: 'p501', name: 'Bukayo Saka', number: 7, position: 'Forward' },
          { id: 'p502', name: 'Martin Odegaard', number: 8, position: 'Midfielder' },
          { id: 'p503', name: 'Kai Havertz', number: 29, position: 'Forward' },
          { id: 'p504', name: 'William Saliba', number: 2, position: 'Defender' },
          { id: 'p505', name: 'David Raya', number: 22, position: 'Goalkeeper' }
        ]
      },
      {
        id: 't6',
        name: 'Cyber City',
        color: '#06b6d4', // cyan
        emblem: 'CC',
        players: [
          { id: 'p601', name: 'Son Heung-min', number: 7, position: 'Forward' },
          { id: 'p602', name: 'James Maddison', number: 10, position: 'Midfielder' },
          { id: 'p603', name: 'Pedro Porro', number: 23, position: 'Defender' },
          { id: 'p604', name: 'Micky van de Ven', number: 37, position: 'Defender' },
          { id: 'p605', name: 'Guglielmo Vicario', number: 13, position: 'Goalkeeper' }
        ]
      }
    ];

    this.fixtures = [
      {
        id: 'f1',
        homeTeamId: 't1', // Vanguard
        awayTeamId: 't2', // Phoenix
        date: '2026-08-15',
        time: '15:00',
        status: 'completed',
        homeScore: 2,
        awayScore: 1,
        goals: [
          { id: 'g1', playerId: 'p101', teamId: 't1', minute: 14 }, // Sterling (Vanguard)
          { id: 'g2', playerId: 'p201', teamId: 't2', minute: 42 }, // Haaland (Phoenix)
          { id: 'g3', playerId: 'p102', teamId: 't1', minute: 78 }  // Pulis (Vanguard)
        ]
      },
      {
        id: 'f2',
        homeTeamId: 't3', // Emerald
        awayTeamId: 't4', // Neon
        date: '2026-08-16',
        time: '18:00',
        status: 'completed',
        homeScore: 2,
        awayScore: 2,
        goals: [
          { id: 'g4', playerId: 'p301', teamId: 't3', minute: 22 }, // Salah (Emerald)
          { id: 'g5', playerId: 'p401', teamId: 't4', minute: 35 }, // Mbappe (Neon)
          { id: 'g6', playerId: 'p403', teamId: 't4', minute: 61 }, // Vinicius (Neon)
          { id: 'g7', playerId: 'p302', teamId: 't3', minute: 89 }  // Diaz (Emerald)
        ]
      },
      {
        id: 'f3',
        homeTeamId: 't5', // Horizon
        awayTeamId: 't6', // Cyber City
        date: '2026-08-17',
        time: '20:00',
        status: 'completed',
        homeScore: 3,
        awayScore: 0,
        goals: [
          { id: 'g8', playerId: 'p501', teamId: 't5', minute: 8 },   // Saka (Horizon)
          { id: 'g9', playerId: 'p501', teamId: 't5', minute: 55 },  // Saka (Horizon)
          { id: 'g10', playerId: 'p502', teamId: 't5', minute: 73 }  // Odegaard (Horizon)
        ]
      },
      {
        id: 'f4',
        homeTeamId: 't2', // Phoenix
        awayTeamId: 't3', // Emerald
        date: '2026-08-22',
        time: '15:00',
        status: 'completed',
        homeScore: 4,
        awayScore: 2,
        goals: [
          { id: 'g11', playerId: 'p201', teamId: 't2', minute: 11 }, // Haaland
          { id: 'g12', playerId: 'p201', teamId: 't2', minute: 33 }, // Haaland
          { id: 'g13', playerId: 'p301', teamId: 't3', minute: 49 }, // Salah
          { id: 'g14', playerId: 'p202', teamId: 't2', minute: 65 }, // De Bruyne
          { id: 'g15', playerId: 'p303', teamId: 't3', minute: 77 }, // Alexis Mac
          { id: 'g16', playerId: 'p201', teamId: 't2', minute: 88 }  // Haaland
        ]
      },
      {
        id: 'f5',
        homeTeamId: 't4', // Neon
        awayTeamId: 't1', // Vanguard
        date: '2026-08-23',
        time: '17:30',
        status: 'completed',
        homeScore: 1,
        awayScore: 0,
        goals: [
          { id: 'g17', playerId: 'p402', teamId: 't4', minute: 50 }  // Bellingham
        ]
      },
      {
        id: 'f6',
        homeTeamId: 't6', // Cyber City
        awayTeamId: 't1', // Vanguard
        date: '2026-08-29',
        time: '15:00',
        status: 'scheduled',
        homeScore: 0,
        awayScore: 0,
        goals: []
      },
      {
        id: 'f7',
        homeTeamId: 't2', // Phoenix
        awayTeamId: 't5', // Horizon
        date: '2026-08-30',
        time: '16:00',
        status: 'scheduled',
        homeScore: 0,
        awayScore: 0,
        goals: []
      },
      {
        id: 'f8',
        homeTeamId: 't3', // Emerald
        awayTeamId: 't6', // Cyber City
        date: '2026-09-05',
        time: '14:30',
        status: 'scheduled',
        homeScore: 0,
        awayScore: 0,
        goals: []
      }
    ];

    this.saveState();
  }

  // Add/Edit/Delete Team
  addTeam(name, color, emblem) {
    const newTeam = {
      id: 't_' + this.generateId(),
      name,
      color,
      emblem,
      players: []
    };
    this.teams.push(newTeam);
    this.saveState();
    return newTeam;
  }

  editTeam(id, name, color, emblem) {
    const team = this.teams.find(t => t.id === id);
    if (team) {
      team.name = name;
      team.color = color;
      team.emblem = emblem;
      this.saveState();
    }
  }

  deleteTeam(id) {
    // Delete team
    this.teams = this.teams.filter(t => t.id !== id);
    // Delete fixtures associated with team
    this.fixtures = this.fixtures.filter(f => f.homeTeamId !== id && f.awayTeamId !== id);
    this.saveState();
  }

  // Add/Edit/Delete Player
  addPlayer(teamId, name, number, position) {
    const team = this.teams.find(t => t.id === teamId);
    if (team) {
      const newPlayer = {
        id: 'p_' + this.generateId(),
        name,
        number: parseInt(number),
        position
      };
      team.players.push(newPlayer);
      this.saveState();
      return newPlayer;
    }
    return null;
  }

  editPlayer(teamId, playerId, name, number, position) {
    const team = this.teams.find(t => t.id === teamId);
    if (team) {
      const player = team.players.find(p => p.id === playerId);
      if (player) {
        player.name = name;
        player.number = parseInt(number);
        player.position = position;
        this.saveState();
      }
    }
  }

  deletePlayer(teamId, playerId) {
    const team = this.teams.find(t => t.id === teamId);
    if (team) {
      team.players = team.players.filter(p => p.id !== playerId);
      // Clean up goals scored by this player in completed fixtures
      this.fixtures.forEach(fixture => {
        if (fixture.goals) {
          fixture.goals = fixture.goals.filter(g => g.playerId !== playerId);
        }
      });
      this.saveState();
    }
  }

  // Add/Edit/Delete Fixture
  addFixture(homeTeamId, awayTeamId, date, time) {
    const newFixture = {
      id: 'f_' + this.generateId(),
      homeTeamId,
      awayTeamId,
      date,
      time,
      status: 'scheduled',
      homeScore: 0,
      awayScore: 0,
      goals: []
    };
    this.fixtures.push(newFixture);
    this.saveState();
    return newFixture;
  }

  editFixture(id, homeTeamId, awayTeamId) {
    const fixture = this.fixtures.find(f => f.id === id);
    if (fixture) {
      fixture.homeTeamId = homeTeamId;
      fixture.awayTeamId = awayTeamId;
      this.saveState();
    }
  }

  saveFixtureResult(id, homeScore, awayScore, isCompleted, goals = []) {
    const fixture = this.fixtures.find(f => f.id === id);
    if (fixture) {
      fixture.homeScore = Math.max(0, parseInt(homeScore, 10) || 0);
      fixture.awayScore = Math.max(0, parseInt(awayScore, 10) || 0);
      fixture.status = isCompleted ? 'completed' : 'scheduled';
      fixture.goals = isCompleted ? goals : [];
      this.saveState();
      return true;
    }
    return false;
  }

  deleteFixture(id) {
    this.fixtures = this.fixtures.filter(f => f.id !== id);
    this.saveState();
  }

  // Calculation Engine
  calculateStandings() {
    const standings = {};

    // Initialize all teams
    this.teams.forEach(team => {
      standings[team.id] = {
        teamId: team.id,
        name: team.name,
        emblem: team.emblem,
        color: team.color,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0
      };
    });

    // Calculate match inputs
    this.fixtures.forEach(f => {
      if (f.status === 'completed' && standings[f.homeTeamId] && standings[f.awayTeamId]) {
        const home = standings[f.homeTeamId];
        const away = standings[f.awayTeamId];

        home.played += 1;
        away.played += 1;

        home.goalsFor += f.homeScore;
        home.goalsAgainst += f.awayScore;
        away.goalsFor += f.awayScore;
        away.goalsAgainst += f.homeScore;

        if (f.homeScore > f.awayScore) {
          home.wins += 1;
          home.points += 3;
          away.losses += 1;
        } else if (f.homeScore < f.awayScore) {
          away.wins += 1;
          away.points += 3;
          home.losses += 1;
        } else {
          home.draws += 1;
          home.points += 1;
          away.draws += 1;
          away.points += 1;
        }
      }
    });

    // Calculate goal difference and prepare sorted list
    const standingsList = Object.values(standings);
    standingsList.forEach(team => {
      team.goalDifference = team.goalsFor - team.goalsAgainst;
    });

    // Sort standings logic
    return standingsList.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
      return a.name.localeCompare(b.name);
    });
  }

  calculateGoalScorers() {
    const scorers = {};

    this.fixtures.forEach(fixture => {
      if (fixture.status === 'completed' && fixture.goals) {
        fixture.goals.forEach(goal => {
          const scorerKey = goal.playerId || `${goal.teamId}:${goal.playerName}`;
          if (!scorers[scorerKey]) {
            // Find player and team info
            let playerInfo = null;
            let teamInfo = this.teams.find(team => team.id === goal.teamId) || null;

            for (const team of this.teams) {
              const p = team.players.find(pl => pl.id === goal.playerId);
              if (p) {
                playerInfo = p;
                teamInfo = team;
                break;
              }
            }

            scorers[scorerKey] = {
              playerId: goal.playerId,
              playerName: playerInfo ? playerInfo.name : (goal.playerName || 'Unknown Player'),
              playerNumber: playerInfo ? playerInfo.number : 0,
              teamName: teamInfo ? teamInfo.name : 'Unknown Team',
              teamColor: teamInfo ? teamInfo.color : '#ffffff',
              teamEmblem: teamInfo ? teamInfo.emblem : 'N/A',
              goals: 0
            };
          }
          scorers[scorerKey].goals += 1;
        });
      }
    });

    return Object.values(scorers).sort((a, b) => b.goals - a.goals);
  }

  // Get total goals for a single player
  getPlayerGoals(playerId) {
    let count = 0;
    this.fixtures.forEach(fixture => {
      if (fixture.status === 'completed' && fixture.goals) {
        fixture.goals.forEach(goal => {
          if (goal.playerId === playerId) count++;
        });
      }
    });
    return count;
  }
}

// GUI Rendering Class
class LeagueApp {
  constructor() {
    this.state = new LeagueState();
    this.state.onChange = () => this.render();
    this.currentFilter = 'all';

    this.initElements();
    this.bindEvents();
    this.render();
  }

  initElements() {
    // Navigation
    this.tabs = document.querySelectorAll('.nav-tab');
    this.tabContents = document.querySelectorAll('.tab-content');

    // Stats
    this.statTeams = document.getElementById('stat-total-teams');
    this.statPlayed = document.getElementById('stat-played-matches');
    this.statGoals = document.getElementById('stat-total-goals');
    this.statLeader = document.getElementById('stat-league-leader');

    // Dashboard Items
    this.dashboardMatchesList = document.getElementById('dashboard-matches-list');
    this.dashboardScorersList = document.getElementById('dashboard-scorers-list');

    // Standings table
    this.standingsTableBody = document.getElementById('standings-tbody');
    this.shareStandingsBtn = document.getElementById('share-standings-btn');
    this.shareStandingsModal = document.getElementById('share-standings-modal');
    this.shareStandingsText = document.getElementById('share-standings-text');

    // Fixtures items
    this.fixturesList = document.getElementById('fixtures-list');
    this.filterButtons = document.querySelectorAll('.btn-filter');
    this.addFixtureBtn = document.getElementById('add-fixture-btn');
    
    // Teams tab items
    this.teamsGrid = document.getElementById('teams-grid');
    this.addTeamBtn = document.getElementById('add-team-btn');

    // Reset button
    this.resetBtn = document.getElementById('reset-data-btn');

    // Modal Overlays
    this.teamModal = document.getElementById('team-modal');
    this.playerModal = document.getElementById('player-modal');
    this.fixtureModal = document.getElementById('fixture-modal');
    this.resultModal = document.getElementById('result-modal');

    // Modal Forms
    this.teamForm = document.getElementById('team-form');
    this.playerForm = document.getElementById('player-form');
    this.fixtureForm = document.getElementById('fixture-form');
    this.resultForm = document.getElementById('result-form');

    // Specific modal elements
    this.teamModalTitle = document.getElementById('team-modal-title');
    this.playerModalTitle = document.getElementById('player-modal-title');
    this.fixtureModalTitle = document.getElementById('fixture-modal-title');
  }

  bindEvents() {
    // Tab switching
    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        
        // Update active class on nav buttons
        this.tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update active class on sections
        this.tabContents.forEach(content => {
          content.classList.remove('active');
          if (content.id === targetTab) {
            content.classList.add('active');
          }
        });

        // Trigger individual renders for performance
        this.render();
      });
    });

    // Quick links
    document.querySelectorAll('.view-all-fixtures').forEach(el => {
      el.addEventListener('click', () => {
        const fixturesTab = Array.from(this.tabs).find(t => t.dataset.tab === 'fixtures');
        if (fixturesTab) fixturesTab.click();
      });
    });

    // Reset system event
    this.resetBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to reset all league data? This will restore mock defaults.')) {
        this.state.resetState();
        this.render();
      }
    });

    // Fixture filtering
    this.filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.dataset.filter;
        this.renderFixturesTab();
      });
    });

    // Open modals buttons
    this.addTeamBtn.addEventListener('click', () => this.openTeamModal());
    this.addFixtureBtn.addEventListener('click', () => this.openFixtureModal());
    this.shareStandingsBtn.addEventListener('click', () => this.shareStandings());
    document.getElementById('copy-standings-btn').addEventListener('click', () => this.copyStandings());
    document.getElementById('system-share-standings-btn').addEventListener('click', () => this.openSystemShare());
    document.getElementById('share-standings-image-btn').addEventListener('click', () => this.shareStandingsImage());
    document.getElementById('download-standings-image-btn').addEventListener('click', () => this.downloadStandingsImage());

    // Close modals
    document.querySelectorAll('[data-close]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = btn.dataset.close;
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.remove('active');
      });
    });

    // Form Submits
    this.teamForm.addEventListener('submit', (e) => this.handleTeamSubmit(e));
    this.playerForm.addEventListener('submit', (e) => this.handlePlayerSubmit(e));
    document.getElementById('save-add-player-btn').addEventListener('click', () => this.handlePlayerSubmit(null, true));
    this.fixtureForm.addEventListener('submit', (e) => this.handleFixtureSubmit(e));
    this.resultForm.addEventListener('submit', (e) => this.handleResultSubmit(e));

    // Dynamic result scoring logic (Home/Away Score change updates Scorer select UI)
    const scoreInputs = [
      document.getElementById('result-home-score'),
      document.getElementById('result-away-score')
    ];
    scoreInputs.forEach(input => {
      input.addEventListener('input', () => this.syncGoalScorersFormInputs());
    });

    // Completed state change checkbox listener inside Result Modal
    const completedCheckbox = document.getElementById('result-completed-checkbox');
    completedCheckbox.addEventListener('change', (e) => {
      const manager = document.getElementById('goal-scorers-manager');
      if (e.target.checked) {
        manager.style.display = 'block';
        this.syncGoalScorersFormInputs();
      } else {
        manager.style.display = 'none';
      }
    });

    // Add scoring rows manually via buttons (just in case they want a quick helper)
    document.getElementById('add-home-goal-btn').addEventListener('click', () => {
      const scoreInput = document.getElementById('result-home-score');
      scoreInput.value = parseInt(scoreInput.value) + 1;
      this.syncGoalScorersFormInputs();
    });

    document.getElementById('add-away-goal-btn').addEventListener('click', () => {
      const scoreInput = document.getElementById('result-away-score');
      scoreInput.value = parseInt(scoreInput.value) + 1;
      this.syncGoalScorersFormInputs();
    });
  }

  render() {
    // Re-trigger icon generations for any dynamic SVG injection
    setTimeout(() => lucide.createIcons(), 50);

    // Global Statistics Box Calculations
    const standings = this.state.calculateStandings();
    const playedMatches = this.state.fixtures.filter(f => f.status === 'completed');
    const totalGoals = playedMatches.reduce((sum, f) => sum + f.homeScore + f.awayScore, 0);
    const leader = standings.length > 0 ? standings[0].emblem + ' ' + standings[0].name : '-';

    this.statTeams.textContent = this.state.teams.length;
    this.statPlayed.textContent = playedMatches.length;
    this.statGoals.textContent = totalGoals;
    this.statLeader.textContent = leader;

    // Call active tab renders
    const activeTab = document.querySelector('.nav-tab.active').dataset.tab;
    if (activeTab === 'dashboard') {
      this.renderDashboardTab();
    } else if (activeTab === 'standings') {
      this.renderStandingsTab(standings);
    } else if (activeTab === 'fixtures') {
      this.renderFixturesTab();
    } else if (activeTab === 'teams') {
      this.renderTeamsTab();
    }
  }

  getStandingsShareText() {
    const standings = this.state.calculateStandings();
    const lines = standings.length
      ? standings.map((team, index) => `${index + 1}. ${team.name} - ${team.points} pts (P${team.played} W${team.wins} D${team.draws} L${team.losses}, GD ${team.goalDifference})`)
      : ['No teams have been added yet.'];
    return `Apex League Standings\n\n${lines.join('\n')}`;
  }

  shareStandings() {
    const shareText = this.getStandingsShareText();
    this.shareStandingsText.value = shareText;
    const encodedText = encodeURIComponent(shareText);
    document.getElementById('whatsapp-standings-link').href = `https://wa.me/?text=${encodedText}`;
    document.getElementById('email-standings-link').href = `mailto:?subject=${encodeURIComponent('Apex League Standings')}&body=${encodedText}`;
    document.getElementById('system-share-standings-btn').hidden = !navigator.share;
    this.shareStandingsModal.classList.add('active');
    this.shareStandingsText.focus();
    lucide.createIcons();
  }

  async openSystemShare() {
    try {
      await navigator.share({ title: 'Apex League Standings', text: this.getStandingsShareText() });
    } catch (error) {
      if (error.name !== 'AbortError') alert('Unable to open the share menu.');
    }
  }

  async copyStandings() {
    const text = this.shareStandingsText.value;
    try {
      if (navigator.clipboard) await navigator.clipboard.writeText(text);
      else throw new Error('Clipboard API unavailable');
    } catch (error) {
      this.shareStandingsText.select();
      document.execCommand('copy');
    }
    const copyButton = document.getElementById('copy-standings-btn');
    copyButton.querySelector('span').textContent = 'Copied';
    setTimeout(() => { copyButton.querySelector('span').textContent = 'Copy'; }, 1500);
  }

  createStandingsImage() {
    const standings = this.state.calculateStandings();
    const canvas = document.createElement('canvas');
    const columns = ['Pos', 'Team', 'P', 'W', 'D', 'L', 'GF', 'GA', 'GD', 'PTS'];
    const columnWidths = [90, 310, 70, 70, 70, 70, 85, 85, 85, 95];
    const sidePadding = 32;
    const rowHeight = 64;
    const headerHeight = 112;
    const tableWidth = columnWidths.reduce((sum, width) => sum + width, 0);
    const logicalWidth = tableWidth + sidePadding * 2;
    const logicalHeight = headerHeight + Math.max(1, standings.length) * rowHeight + sidePadding * 2;
    const scale = Math.min(1, 900 / logicalWidth);
    canvas.width = Math.ceil(logicalWidth * scale);
    canvas.height = Math.ceil(logicalHeight * scale);
    const context = canvas.getContext('2d');
    const tableLeft = sidePadding;
    context.scale(scale, scale);

    context.fillStyle = '#0b1220';
    context.fillRect(0, 0, logicalWidth, logicalHeight);
    context.fillStyle = '#ffffff';
    context.font = '700 28px Arial';
    context.fillText('Apex League Standings', tableLeft, 42);
    context.fillStyle = '#94a3b8';
    context.font = '14px Arial';
    context.fillText('League Table', tableLeft, 70);
    context.fillStyle = '#172235';
    context.fillRect(tableLeft, headerHeight, tableWidth, rowHeight);
    context.font = '700 13px Arial';
    let x = tableLeft;
    columns.forEach((column, index) => {
      context.fillStyle = '#cbd5e1';
      context.textAlign = index === 1 ? 'left' : 'center';
      context.fillText(column, index === 1 ? x + 12 : x + columnWidths[index] / 2, headerHeight + 39);
      x += columnWidths[index];
    });

    standings.forEach((team, rowIndex) => {
      const y = headerHeight + rowHeight + rowIndex * rowHeight;
      context.fillStyle = rowIndex % 2 === 0 ? '#101a2b' : '#0d1726';
      context.fillRect(tableLeft, y, tableWidth, rowHeight);
      const values = [rowIndex + 1, team.name, team.played, team.wins, team.draws, team.losses, team.goalsFor, team.goalsAgainst, team.goalDifference, team.points];
      x = tableLeft;
      values.forEach((value, index) => {
        context.fillStyle = index === 9 ? '#fbbf24' : '#f8fafc';
        context.font = index === 1 ? '600 15px Arial' : '14px Arial';
        context.textAlign = index === 1 ? 'left' : 'center';
        let text = String(value);
        if (index === 1 && context.measureText(text).width > columnWidths[index] - 24) {
          while (text.length > 3 && context.measureText(`${text}...`).width > columnWidths[index] - 24) text = text.slice(0, -1);
          text += '...';
        }
        context.fillText(text, index === 1 ? x + 12 : x + columnWidths[index] / 2, y + 39);
        x += columnWidths[index];
      });
    });

    context.strokeStyle = '#334155';
    context.lineWidth = 2;
    context.strokeRect(tableLeft, headerHeight, tableWidth, rowHeight + standings.length * rowHeight);
    return canvas;
  }

  async getStandingsImageFile() {
    const blob = await new Promise(resolve => this.createStandingsImage().toBlob(resolve, 'image/png'));
    return new File([blob], 'apex-league-standings.png', { type: 'image/png' });
  }

  async shareStandingsImage() {
    try {
      const file = await this.getStandingsImageFile();
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ title: 'Apex League Standings', files: [file] });
      } else {
        this.downloadStandingsImage();
        alert('Image sharing is not supported here. The table image was downloaded instead.');
      }
    } catch (error) {
      if (error.name !== 'AbortError') alert('Unable to share the table image.');
    }
  }

  downloadStandingsImage() {
    this.createStandingsImage().toBlob(blob => {
      if (!blob) {
        alert('Unable to create the standings image. Please try again.');
        return;
      }
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'apex-league-standings.png';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        URL.revokeObjectURL(link.href);
        link.remove();
      }, 2000);
    }, 'image/png');
  }

  // ==========================================================
  // DASHBOARD TAB RENDERING
  // ==========================================================
  renderDashboardTab() {
    // 1. Render Key Matches: list up to 5 latest matches (recent results + next upcoming)
    this.dashboardMatchesList.innerHTML = '';
    
    // Sort matches chronologically, and split into played vs. unplayed
    const completed = this.state.fixtures.filter(f => f.status === 'completed').slice(-3).reverse();
    
    const upcoming = this.state.fixtures.filter(f => f.status === 'scheduled').slice(0, 3);

    const displayMatches = [...completed, ...upcoming];

    if (displayMatches.length === 0) {
      this.dashboardMatchesList.innerHTML = `
        <div class="empty-state">
          <i data-lucide="calendar"></i>
          <p>No fixtures configured yet.</p>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    displayMatches.forEach(fixture => {
      const homeTeam = this.state.teams.find(t => t.id === fixture.homeTeamId);
      const awayTeam = this.state.teams.find(t => t.id === fixture.awayTeamId);
      if (!homeTeam || !awayTeam) return;

      const card = document.createElement('div');
      card.className = 'mini-match-card';

      const scoreHtml = fixture.status === 'completed' 
        ? `<span>${fixture.homeScore}</span><span style="color:var(--text-muted)">-</span><span>${fixture.awayScore}</span>`
        : `<span class="score-unplayed">VS</span>`;

      card.innerHTML = `
        <div class="mini-match-meta">${fixture.status === 'completed' ? 'Full Time' : 'Upcoming'}</div>
        <div class="mini-match-team home-team">
          <span class="mini-team-name">${homeTeam.name}</span>
          <span class="mini-team-emblem" style="box-shadow: 0 0 10px ${homeTeam.color}33; border: 1.5px solid ${homeTeam.color}">${homeTeam.emblem}</span>
        </div>
        <div class="mini-match-score">${scoreHtml}</div>
        <div class="mini-match-team away-team">
          <span class="mini-team-emblem" style="box-shadow: 0 0 10px ${awayTeam.color}33; border: 1.5px solid ${awayTeam.color}">${awayTeam.emblem}</span>
          <span class="mini-team-name">${awayTeam.name}</span>
        </div>
      `;

      this.dashboardMatchesList.appendChild(card);
    });

    // 2. Render Golden Boot leaderboard
    this.dashboardScorersList.innerHTML = '';
    const scorers = this.state.calculateGoalScorers().slice(0, 5); // top 5

    if (scorers.length === 0) {
      this.dashboardScorersList.innerHTML = `
        <div class="empty-state">
          <i data-lucide="goal"></i>
          <p>No goals scored yet.</p>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    scorers.forEach((scorer, idx) => {
      const row = document.createElement('div');
      row.className = 'leaderboard-item';

      row.innerHTML = `
        <div class="player-info-cell">
          <span class="player-rank">#${idx + 1}</span>
          <div class="player-name-role">
            <span class="player-name-val">${scorer.playerName}</span>
            <span style="font-size: 11px; color: var(--text-muted)">#${scorer.playerNumber}</span>
          </div>
        </div>
        <div class="player-team-val">
          <span style="margin-right: 4px;">${scorer.teamEmblem}</span>
          <span>${scorer.teamName}</span>
        </div>
        <div class="player-goals-val">${scorer.goals}</div>
      `;
      this.dashboardScorersList.appendChild(row);
    });
    lucide.createIcons();
  }

  // ==========================================================
  // STANDINGS TAB RENDERING
  // ==========================================================
  renderStandingsTab(standingsList) {
    this.standingsTableBody.innerHTML = '';

    if (standingsList.length === 0) {
      this.standingsTableBody.innerHTML = `
        <tr>
          <td colspan="10" class="text-center" style="padding: 40px 0;">
            <div class="empty-state">
              <i data-lucide="list-ordered"></i>
              <p>Add teams to view the league table standings.</p>
            </div>
          </td>
        </tr>
      `;
      lucide.createIcons();
      return;
    }

    standingsList.forEach((team, index) => {
      const row = document.createElement('tr');
      
      row.innerHTML = `
        <td><span class="pos-val">${index + 1}</span></td>
        <td>
          <div class="team-cell">
            <span class="team-emblem-circle" style="background-color: ${team.color}15; border: 1.5px solid ${team.color}">${team.emblem}</span>
            <span class="team-name-bold">${team.name}</span>
          </div>
        </td>
        <td class="text-center">${team.played}</td>
        <td class="text-center">${team.wins}</td>
        <td class="text-center">${team.draws}</td>
        <td class="text-center">${team.losses}</td>
        <td class="text-center">${team.goalsFor}</td>
        <td class="text-center">${team.goalsAgainst}</td>
        <td class="text-center" style="color: ${team.goalDifference > 0 ? 'var(--color-emerald)' : team.goalDifference < 0 ? 'var(--color-red)' : 'var(--text-secondary)'}">
          ${team.goalDifference > 0 ? '+' + team.goalDifference : team.goalDifference}
        </td>
        <td class="text-center highlight-column" style="color: ${index === 0 ? 'var(--color-yellow)' : 'var(--text-primary)'}">${team.points}</td>
      `;
      this.standingsTableBody.appendChild(row);
    });
    lucide.createIcons();
  }

  // ==========================================================
  // FIXTURES TAB RENDERING
  // ==========================================================
  renderFixturesTab() {
    this.fixturesList.innerHTML = '';

    let filteredFixtures = this.state.fixtures;
    if (this.currentFilter === 'scheduled') {
      filteredFixtures = this.state.fixtures.filter(f => f.status === 'scheduled');
    } else if (this.currentFilter === 'completed') {
      filteredFixtures = this.state.fixtures.filter(f => f.status === 'completed');
    }

    if (filteredFixtures.length === 0) {
      this.fixturesList.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <i data-lucide="calendar"></i>
          <p>No matches matching filter criteria.</p>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    filteredFixtures.forEach(fixture => {
      const homeTeam = this.state.teams.find(t => t.id === fixture.homeTeamId);
      const awayTeam = this.state.teams.find(t => t.id === fixture.awayTeamId);
      if (!homeTeam || !awayTeam) return;

      const card = document.createElement('div');
      card.className = 'fixture-card glass-panel';

      const tagClass = fixture.status === 'completed' ? 'tag-completed' : 'tag-scheduled';
      const tagText = fixture.status === 'completed' ? 'Full Time' : 'Upcoming';

      // Score Area
      const scoreHtml = fixture.status === 'completed'
        ? `<span class="score-text">${fixture.homeScore}</span><span class="vs-divider">-</span><span class="score-text">${fixture.awayScore}</span>`
        : `<span class="vs-divider">VS</span>`;

      // Build Goal Scorers text if match is completed
      let scorersHtml = '';
      if (fixture.status === 'completed' && fixture.goals && fixture.goals.length > 0) {
        const homeGoals = fixture.goals.filter(g => g.teamId === fixture.homeTeamId).sort((a,b)=>a.minute - b.minute);
        const awayGoals = fixture.goals.filter(g => g.teamId === fixture.awayTeamId).sort((a,b)=>a.minute - b.minute);

        const renderScorersList = (goals, team) => {
          return goals.map(g => {
            const player = team.players.find(p => p.id === g.playerId);
            const name = player ? player.name.split(' ').pop() : (g.playerName || 'Unknown');
            const minText = g.minute ? ` (${g.minute}')` : '';
            return `<span class="scorer-event">${name}${minText}</span>`;
          }).join('');
        };

        scorersHtml = `
          <div class="fixture-scorers-detail">
            <div class="scorers-col home-scorers">${renderScorersList(homeGoals, homeTeam)}</div>
            <div class="scorers-col away-scorers">${renderScorersList(awayGoals, awayTeam)}</div>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="fixture-meta">
          <span class="match-tag ${tagClass}">${tagText}</span>
        </div>
        
        <div class="fixture-score-area">
          <div class="fixture-team-col">
            <span class="team-emblem-medium" style="border: 2px solid ${homeTeam.color}; box-shadow: 0 0 12px ${homeTeam.color}25">${homeTeam.emblem}</span>
            <span class="team-name-lbl">${homeTeam.name}</span>
          </div>
          <div class="fixture-score-display">${scoreHtml}</div>
          <div class="fixture-team-col">
            <span class="team-emblem-medium" style="border: 2px solid ${awayTeam.color}; box-shadow: 0 0 12px ${awayTeam.color}25">${awayTeam.emblem}</span>
            <span class="team-name-lbl">${awayTeam.name}</span>
          </div>
        </div>
        
        ${scorersHtml}
        
        <div class="fixture-actions">
          <button class="btn btn-secondary-outline btn-sm edit-fixture-btn" data-id="${fixture.id}">
            <i data-lucide="edit-3"></i>
            <span>Edit Match</span>
          </button>
          <button class="btn btn-primary btn-sm result-fixture-btn" data-id="${fixture.id}">
            <i data-lucide="trophy"></i>
            <span>${fixture.status === 'completed' ? 'Edit Score' : 'Add Result'}</span>
          </button>
          <button class="btn btn-danger-outline btn-sm delete-fixture-btn" data-id="${fixture.id}">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      `;

      // Event Listeners for actions
      card.querySelector('.edit-fixture-btn').addEventListener('click', () => this.openFixtureModal(fixture.id));
      card.querySelector('.result-fixture-btn').addEventListener('click', () => this.openResultModal(fixture.id));
      card.querySelector('.delete-fixture-btn').addEventListener('click', () => {
        if (confirm('Delete this fixture?')) {
          this.state.deleteFixture(fixture.id);
          this.render();
        }
      });

      this.fixturesList.appendChild(card);
    });

    lucide.createIcons();
  }

  // ==========================================================
  // TEAMS & ROSTERS TAB RENDERING
  // ==========================================================
  renderTeamsTab() {
    this.teamsGrid.innerHTML = '';

    if (this.state.teams.length === 0) {
      this.teamsGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <i data-lucide="users"></i>
          <p>No teams created. Click "Add New Team" above to begin building rosters.</p>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    this.state.teams.forEach(team => {
      const card = document.createElement('div');
      card.className = 'team-card glass-panel';
      card.style.borderLeftColor = team.color;
      card.id = `team-card-${team.id}`;

      // Calculate total goals scored by team players
      const teamPlayersCount = team.players.length;

      // Render players roster list
      let playersHtml = '';
      if (teamPlayersCount === 0) {
        playersHtml = `
          <div class="empty-state" style="padding: 20px 0;">
            <p style="font-size: 13px;">No players registered in roster.</p>
          </div>
        `;
      } else {
        // Sort players by position and goals
        const sortedPlayers = [...team.players].sort((a,b) => {
          const goalsA = this.state.getPlayerGoals(a.id);
          const goalsB = this.state.getPlayerGoals(b.id);
          if (goalsB !== goalsA) return goalsB - goalsA;
          return a.name.localeCompare(b.name);
        });

        sortedPlayers.forEach(player => {
          const goals = this.state.getPlayerGoals(player.id);
          const goalsBadge = goals > 0 
            ? `<span class="player-goals-count"><i data-lucide="goal"></i> ${goals}</span>`
            : '';

          playersHtml += `
            <div class="player-item">
              <div class="player-badge-meta">
                <span class="player-jersey">${player.number}</span>
                <div class="player-name-role">
                  <span class="player-name-txt">${player.name}</span>
                  <span class="player-role-txt">${player.position}</span>
                </div>
              </div>
              <div class="player-stats-actions">
                ${goalsBadge}
                <button class="btn-icon edit-btn edit-player-btn" data-team-id="${team.id}" data-player-id="${player.id}">
                  <i data-lucide="edit-2"></i>
                </button>
                <button class="btn-icon delete-btn delete-player-btn" data-team-id="${team.id}" data-player-id="${player.id}">
                  <i data-lucide="user-minus"></i>
                </button>
              </div>
            </div>
          `;
        });
      }

      card.innerHTML = `
        <div class="team-card-header">
          <div class="team-card-info">
            <span class="team-logo-display" style="background-color: ${team.color}15; border: 2px solid ${team.color}">${team.emblem}</span>
            <div>
              <h3 class="team-name-title">${team.name}</h3>
              <span class="team-roster-count">${teamPlayersCount} Players registered</span>
            </div>
          </div>
          <div class="team-controls-header">
            <button class="btn-icon edit-btn edit-team-btn" data-id="${team.id}">
              <i data-lucide="edit-3"></i>
            </button>
            <button class="btn-icon delete-btn delete-team-btn" data-id="${team.id}">
              <i data-lucide="trash-2"></i>
            </button>
            <button class="btn-icon toggle-roster-btn">
              <i data-lucide="chevron-down" class="icon-chevron"></i>
            </button>
          </div>
        </div>
        
        <div class="team-roster-details">
          <div class="roster-header">
            <h4>Squad Roster</h4>
            <button class="btn btn-secondary-outline btn-sm add-player-btn" data-team-id="${team.id}">
              <i data-lucide="plus"></i> Sign Player
            </button>
          </div>
          <div class="players-list">
            ${playersHtml}
          </div>
        </div>
      `;

      // Event listener for expansion toggle
      const header = card.querySelector('.team-card-header');
      const toggleBtn = card.querySelector('.toggle-roster-btn');
      
      const toggleRoster = (e) => {
        // Prevent toggling if clicked on edit/delete actions
        if (e.target.closest('.edit-team-btn') || e.target.closest('.delete-team-btn')) return;
        card.classList.toggle('expanded');
      };
      
      header.addEventListener('click', toggleRoster);

      // Bind CRUD events on Team & Player inside card
      card.querySelector('.edit-team-btn').addEventListener('click', () => this.openTeamModal(team.id));
      card.querySelector('.delete-team-btn').addEventListener('click', () => {
        if (confirm(`Are you sure you want to delete ${team.name}? This will remove all their players and fixtures!`)) {
          this.state.deleteTeam(team.id);
          this.render();
        }
      });

      card.querySelector('.add-player-btn').addEventListener('click', () => this.openPlayerModal(team.id));
      
      card.querySelectorAll('.edit-player-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.openPlayerModal(btn.dataset.teamId, btn.dataset.playerId);
        });
      });

      card.querySelectorAll('.delete-player-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          if (confirm('Release player from roster?')) {
            this.state.deletePlayer(btn.dataset.teamId, btn.dataset.playerId);
            this.render();
            // keep expanded
            document.getElementById(`team-card-${team.id}`).classList.add('expanded');
          }
        });
      });

      this.teamsGrid.appendChild(card);
    });

    lucide.createIcons();
  }

  // ==========================================================
  // MODAL LOGIC & FORM PREPARATION
  // ==========================================================
  openTeamModal(teamId = null) {
    this.teamForm.reset();
    document.getElementById('team-id-input').value = teamId || '';

    if (teamId) {
      this.teamModalTitle.textContent = 'Edit Team Details';
      const team = this.state.teams.find(t => t.id === teamId);
      if (team) {
        document.getElementById('team-name-input').value = team.name;
      }
    } else {
      this.teamModalTitle.textContent = 'Add New Team';
    }
    this.teamModal.classList.add('active');
  }

  openPlayerModal(teamId, playerId = null) {
    this.playerForm.reset();
    document.getElementById('player-team-id-input').value = teamId;
    document.getElementById('player-id-input').value = playerId || '';
    document.getElementById('save-add-player-btn').hidden = Boolean(playerId);

    if (playerId) {
      this.playerModalTitle.textContent = 'Edit Player Card';
      const team = this.state.teams.find(t => t.id === teamId);
      if (team) {
        const player = team.players.find(p => p.id === playerId);
        if (player) {
          document.getElementById('player-name-input').value = player.name;
          document.getElementById('player-number-input').value = player.number;
          document.getElementById('player-position-input').value = player.position;
        }
      }
    } else {
      this.playerModalTitle.textContent = 'Register Squad Player';
    }
    this.playerModal.classList.add('active');
  }

  openFixtureModal(fixtureId = null) {
    this.fixtureForm.reset();
    document.getElementById('fixture-id-input').value = fixtureId || '';
    const fixtureCountInput = document.getElementById('fixture-count-input');
    fixtureCountInput.value = 1;
    fixtureCountInput.disabled = Boolean(fixtureId);

    // Populate team options
    const homeSelect = document.getElementById('fixture-home-input');
    const awaySelect = document.getElementById('fixture-away-input');

    const getOptionsHtml = () => {
      let html = '<option value="" disabled selected>Select Team</option>';
      this.state.teams.forEach(team => {
        html += `<option value="${team.id}">${team.emblem} ${team.name}</option>`;
      });
      return html;
    };

    homeSelect.innerHTML = getOptionsHtml();
    awaySelect.innerHTML = getOptionsHtml();
    document.getElementById('fixture-team-help').hidden = this.state.teams.length >= 2;

    if (fixtureId) {
      this.fixtureModalTitle.textContent = 'Edit Match';
      const fixture = this.state.fixtures.find(f => f.id === fixtureId);
      if (fixture) {
        homeSelect.value = fixture.homeTeamId;
        awaySelect.value = fixture.awayTeamId;
      }
    } else {
      this.fixtureModalTitle.textContent = 'Schedule League Match';
    }

    this.fixtureModal.classList.add('active');
  }

  openResultModal(fixtureId) {
    this.resultForm.reset();
    const fixture = this.state.fixtures.find(f => f.id === fixtureId);
    if (!fixture) return;

    const homeTeam = this.state.teams.find(t => t.id === fixture.homeTeamId);
    const awayTeam = this.state.teams.find(t => t.id === fixture.awayTeamId);
    if (!homeTeam || !awayTeam) return;

    document.getElementById('result-fixture-id-input').value = fixtureId;

    // Header scorecard setup
    document.getElementById('result-home-name').textContent = homeTeam.name;
    document.getElementById('result-home-emblem').textContent = homeTeam.emblem;
    document.getElementById('result-away-name').textContent = awayTeam.name;
    document.getElementById('result-away-emblem').textContent = awayTeam.emblem;

    // Title labels for scorers sections
    document.getElementById('home-scorers-title').textContent = `${homeTeam.name} Scorers`;
    document.getElementById('away-scorers-title').textContent = `${awayTeam.name} Scorers`;

    // Fill score inputs
    const homeScoreInput = document.getElementById('result-home-score');
    const awayScoreInput = document.getElementById('result-away-score');
    homeScoreInput.value = fixture.status === 'completed' ? fixture.homeScore : 0;
    awayScoreInput.value = fixture.status === 'completed' ? fixture.awayScore : 0;

    // Checked status for completion
    const completedCheckbox = document.getElementById('result-completed-checkbox');
    completedCheckbox.checked = fixture.status === 'completed';

    const manager = document.getElementById('goal-scorers-manager');
    manager.style.display = completedCheckbox.checked ? 'block' : 'none';

    // Build existing goal scorers lists if completed
    this.syncGoalScorersFormInputs(fixture.goals);

    this.resultModal.classList.add('active');
  }

  // Synchronizes goal scorer drop downs dynamically based on Score input fields
  syncGoalScorersFormInputs(prepopulatedGoals = null) {
    const isCompleted = document.getElementById('result-completed-checkbox').checked;
    if (!isCompleted) return;

    const fixtureId = document.getElementById('result-fixture-id-input').value;
    const fixture = this.state.fixtures.find(f => f.id === fixtureId);
    if (!fixture) return;

    const homeTeam = this.state.teams.find(t => t.id === fixture.homeTeamId);
    const awayTeam = this.state.teams.find(t => t.id === fixture.awayTeamId);

    const homeScore = Math.max(0, parseInt(document.getElementById('result-home-score').value) || 0);
    const awayScore = Math.max(0, parseInt(document.getElementById('result-away-score').value) || 0);

    const homeGoalsList = document.getElementById('home-goals-list');
    const awayGoalsList = document.getElementById('away-goals-list');

    // Helper: generate name suggestions from the team's roster
    const getPlayerNameSuggestions = (team) => {
      let options = '';
      team.players.forEach(p => {
        options += `<option value="${p.name}">`;
      });
      return options;
    };

    const buildGoalRows = (listEl, score, team, currentTeamGoals = []) => {
      listEl.innerHTML = '';
      if (score === 0) {
        listEl.innerHTML = `<span style="font-size: 12px; color: var(--text-muted)">No goals scored</span>`;
        return;
      }

      for (let i = 0; i < score; i++) {
        const row = document.createElement('div');
        row.className = 'goal-entry-row';

        const savedGoal = currentTeamGoals[i] || null;

        const uniqueListId = `players-${team.id}-${i}`;
        const minuteVal = savedGoal ? savedGoal.minute : '';
        const savedPlayer = savedGoal && team.players.find(player => player.id === savedGoal.playerId);
        const savedPlayerName = savedPlayer ? savedPlayer.name : (savedGoal?.playerName || '');

        row.innerHTML = `
          <input type="text" class="scorer-name-input" list="${uniqueListId}" placeholder="Scorer name" value="${savedPlayerName}" required>
          <datalist id="${uniqueListId}">${getPlayerNameSuggestions(team)}</datalist>
          <input type="number" class="goal-minute-input" min="1" max="120" placeholder="Min" value="${minuteVal}">
          <button type="button" class="btn-remove-goal">&times;</button>
        `;

        // Bind delete action
        row.querySelector('.btn-remove-goal').addEventListener('click', () => {
          // Decrement score on input, which triggers sync
          const scoreInput = document.getElementById(team.id === homeTeam.id ? 'result-home-score' : 'result-away-score');
          scoreInput.value = Math.max(0, parseInt(scoreInput.value) - 1);
          this.syncGoalScorersFormInputs();
        });

        listEl.appendChild(row);
      }
    };

    // Calculate currently loaded goals to preserve user state before rewriting rows
    let activeHomeGoals = [];
    let activeAwayGoals = [];

    if (prepopulatedGoals) {
      activeHomeGoals = prepopulatedGoals.filter(g => g.teamId === homeTeam.id);
      activeAwayGoals = prepopulatedGoals.filter(g => g.teamId === awayTeam.id);
    } else {
      // Read current state from the active DOM selects to prevent losing inputs when score increments
      const readDOMElements = (listEl, teamId) => {
        const rows = listEl.querySelectorAll('.goal-entry-row');
        const list = [];
        rows.forEach(row => {
          const nameVal = row.querySelector('.scorer-name-input').value.trim();
          const minVal = parseInt(row.querySelector('.goal-minute-input').value) || '';
          if (nameVal) {
            const team = this.state.teams.find(currentTeam => currentTeam.id === teamId);
            const player = team?.players.find(currentPlayer => currentPlayer.name === nameVal);
            list.push({ playerId: player?.id || null, playerName: nameVal, teamId: teamId, minute: minVal });
          }
        });
        return list;
      };
      activeHomeGoals = readDOMElements(homeGoalsList, homeTeam.id);
      activeAwayGoals = readDOMElements(awayGoalsList, awayTeam.id);
    }

    buildGoalRows(homeGoalsList, homeScore, homeTeam, activeHomeGoals);
    buildGoalRows(awayGoalsList, awayScore, awayTeam, activeAwayGoals);

    lucide.createIcons();
  }

  // ==========================================================
  // CRUD SUBMIT HANDLERS
  // ==========================================================
  handleTeamSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('team-id-input').value;
    const name = document.getElementById('team-name-input').value.trim();

    if (!name) return;

    const teamColorPalette = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#ef4444', '#06b6d4', '#a3e635'];
    const color = id
      ? this.state.teams.find(team => team.id === id)?.color || teamColorPalette[0]
      : teamColorPalette[Math.floor(Math.random() * teamColorPalette.length)];

    const emblem = id
      ? this.state.teams.find(team => team.id === id)?.emblem || name.slice(0, 4).toUpperCase()
      : name.split(/\s+/).map(part => part[0]).join('').slice(0, 4).toUpperCase() || 'TEAM';

    if (id) {
      this.state.editTeam(id, name, color, emblem);
    } else {
      this.state.addTeam(name, color, emblem);
    }

    this.teamModal.classList.remove('active');
    this.render();
  }

  handlePlayerSubmit(e, keepOpen = false) {
    if (e) e.preventDefault();
    const teamId = document.getElementById('player-team-id-input').value;
    const playerId = document.getElementById('player-id-input').value;
    const name = document.getElementById('player-name-input').value.trim();
    const number = document.getElementById('player-number-input').value;
    const position = document.getElementById('player-position-input').value;

    if (!name || !number || !position) return;

    if (playerId) {
      this.state.editPlayer(teamId, playerId, name, number, position);
    } else {
      this.state.addPlayer(teamId, name, number, position);
    }

    this.render();

    if (keepOpen) {
      this.playerForm.reset();
      document.getElementById('player-team-id-input').value = teamId;
      this.playerModalTitle.textContent = 'Register Squad Player';
    } else {
      this.playerModal.classList.remove('active');
    }

    // Keep the team roster expanded for immediate visual feedback
    const teamCard = document.getElementById(`team-card-${teamId}`);
    if (teamCard) teamCard.classList.add('expanded');
  }

  handleFixtureSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('fixture-id-input').value;
    const homeTeamId = document.getElementById('fixture-home-input').value;
    const awayTeamId = document.getElementById('fixture-away-input').value;
    const matchCount = Math.min(20, Math.max(1, parseInt(document.getElementById('fixture-count-input').value) || 1));

    if (!homeTeamId || !awayTeamId) {
      alert('Select both a home team and an away team.');
      return;
    }

    if (homeTeamId === awayTeamId) {
      alert('Error: A team cannot play against itself. Please choose two distinct teams.');
      return;
    }

    if (id) {
      this.state.editFixture(id, homeTeamId, awayTeamId);
    } else {
      for (let matchNumber = 0; matchNumber < matchCount; matchNumber++) {
        const isReversed = matchNumber % 2 === 1;
        this.state.addFixture(
          isReversed ? awayTeamId : homeTeamId,
          isReversed ? homeTeamId : awayTeamId,
          '',
          ''
        );
      }
    }

    this.fixtureModal.classList.remove('active');
    this.render();
  }

  handleResultSubmit(e) {
    e.preventDefault();
    const fixtureId = document.getElementById('result-fixture-id-input').value;
    const homeScore = parseInt(document.getElementById('result-home-score').value) || 0;
    const awayScore = parseInt(document.getElementById('result-away-score').value) || 0;
    const isCompleted = document.getElementById('result-completed-checkbox').checked;

    const fixture = this.state.fixtures.find(f => f.id === fixtureId);
    if (!fixture) return;

    const goals = [];

    if (isCompleted) {
      // Collect home scorers
      const homeRows = document.getElementById('home-goals-list').querySelectorAll('.goal-entry-row');
      homeRows.forEach(row => {
        const nameInput = row.querySelector('.scorer-name-input');
        const minInput = row.querySelector('.goal-minute-input');
        const playerName = nameInput.value.trim();
        if (playerName) {
          const player = this.state.teams.find(team => team.id === fixture.homeTeamId)?.players
            .find(currentPlayer => currentPlayer.name === playerName);
          goals.push({
            id: 'g_' + this.state.generateId(),
            playerId: player?.id || null,
            playerName,
            teamId: fixture.homeTeamId,
            minute: parseInt(minInput.value) || null
          });
        }
      });

      // Collect away scorers
      const awayRows = document.getElementById('away-goals-list').querySelectorAll('.goal-entry-row');
      awayRows.forEach(row => {
        const nameInput = row.querySelector('.scorer-name-input');
        const minInput = row.querySelector('.goal-minute-input');
        const playerName = nameInput.value.trim();
        if (playerName) {
          const player = this.state.teams.find(team => team.id === fixture.awayTeamId)?.players
            .find(currentPlayer => currentPlayer.name === playerName);
          goals.push({
            id: 'g_' + this.state.generateId(),
            playerId: player?.id || null,
            playerName,
            teamId: fixture.awayTeamId,
            minute: parseInt(minInput.value) || null
          });
        }
      });
      
      // Validation check: did they enter goals but miss scorer selections?
      const expectedTotalGoals = homeScore + awayScore;
      if (expectedTotalGoals > 0 && goals.length < expectedTotalGoals) {
        if (!confirm('Warning: You entered scores but did not select all goal scorers. Do you want to save anyway?')) {
          return;
        }
      }
    }

    if (!this.state.saveFixtureResult(fixtureId, homeScore, awayScore, isCompleted, goals)) {
      alert('This match could not be found. Please refresh the page and try again.');
      return;
    }
    this.resultModal.classList.remove('active');
    this.render();
  }
}

// Instantiate App
document.addEventListener('DOMContentLoaded', () => {
  window.app = new LeagueApp();
});
