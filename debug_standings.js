const mysql = require('mysql2/promise');
const db = require('./src/config/db');

async function debugStandings() {
    try {
        console.log('=== DEBUG CLASSEMENT REGROUPÉ PAR CLUB ===');
        
        const tournamentId = 1; // ID du tournoi à tester
        
        // Récupérer toutes les équipes du tournoi
        const [teams] = await db.query('SELECT * FROM Team WHERE Tournament_Id = ?', [tournamentId]);
        
        console.log('Équipes dans le tournoi:', teams.length);
        teams.forEach(team => {
            console.log(`- Team_Id: ${team.Team_Id}, Name: ${team.name}, Catégorie: ${team.age_category}`);
        });
        
        // Récupérer toutes les équipes du tournoi associées à des poules
        const [teamsInPools] = await db.query(
            'SELECT DISTINCT t.* FROM Team t JOIN PoolTeam pt ON t.Team_Id = pt.Team_Id ' +
            'JOIN Pool p ON pt.Pool_Id = p.Pool_Id JOIN Phase ph ON p.Phase_Id = ph.Phase_Id ' +
            'WHERE ph.Tournament_Id = ? AND t.Tournament_Id = ?',
            [tournamentId, tournamentId]
        );
        
        console.log('\nÉquipes associées à des poules:', teamsInPools.length);
        teamsInPools.forEach(team => {
            console.log(`- Team_Id: ${team.Team_Id}, Name: ${team.name}, Catégorie: ${team.age_category}`);
        });
        
        // Vérifier les matchs du tournoi
        const [games] = await db.query('SELECT * FROM Game WHERE Tournament_Id = ?', [tournamentId]);
        
        console.log('\nMatchs trouvés:', games.length);
        games.forEach(game => {
            console.log(`- Game_Id: ${game.Game_Id}, Team1: ${game.Team1_Id} vs Team2: ${game.Team2_Id}, Score: ${game.Team1_Score}-${game.Team2_Score}, Terminé: ${game.is_completed}`);
        });
        
        // Identifier les équipes qui participent effectivement à des matchs
        const teamIdsInGames = new Set();
        games.forEach(game => {
            teamIdsInGames.add(game.Team1_Id);
            teamIdsInGames.add(game.Team2_Id);
        });
        
        console.log('\nÉquipes participant aux matchs:', teamIdsInGames.size);
        console.log('IDs des équipes dans les matchs:', Array.from(teamIdsInGames).join(', '));
        
        // Filtrer les équipes qui participent aux matchs
        const teamsInGames = teams.filter(team => teamIdsInGames.has(team.Team_Id));
        
        console.log('\nÉquipes après filtrage (celles qui participent aux matchs):', teamsInGames.length);
        teamsInGames.forEach(team => {
            console.log(`- Team_Id: ${team.Team_Id}, Name: ${team.name}, Catégorie: ${team.age_category}`);
        });
        
        // Regrouper les équipes par nom de club (ignorer la catégorie d'âge)
        const clubsMap = new Map();
        teamsInGames.forEach(team => {
            // Extrait le nom du club (sans la catégorie d'âge)
            // Par exemple: "FC Barcelona U10" => "FC Barcelona"
            const clubName = team.name.replace(/\s+U\d+$/, '').trim();
            
            if (!clubsMap.has(clubName)) {
                clubsMap.set(clubName, {
                    name: clubName,
                    teamIds: [team.Team_Id], // Stocker tous les IDs d'équipes du même club
                    matchesPlayed: 0,
                    wins: 0,
                    losses: 0,
                    draws: 0,
                    points: 0,
                    logo: team.logo
                });
            } else {
                // Ajouter cet ID d'équipe au club existant
                clubsMap.get(clubName).teamIds.push(team.Team_Id);
            }
        });
        
        console.log('\nClubs trouvés après regroupement:', clubsMap.size);
        for (const [clubName, club] of clubsMap.entries()) {
            console.log(`- Club: ${clubName}, Team_Ids: [${club.teamIds.join(', ')}]`);
        }
        
        console.log('\nCalcul du classement par club...');
        
        games.forEach(game => {
            if (game.is_completed) {
                console.log(`\nTraitement du match: ${game.Team1_Id} vs ${game.Team2_Id}`);
                console.log(`Score: ${game.Team1_Score}-${game.Team2_Score}, Terminé: ${game.is_completed}`);
                
                // Trouver les clubs correspondant aux équipes du match
                let team1Club = null;
                let team2Club = null;
                
                // Rechercher le club contenant l'ID de l'équipe 1 et 2
                for (const [name, club] of clubsMap.entries()) {
                    if (club.teamIds.includes(game.Team1_Id)) {
                        team1Club = club;
                        console.log(`Équipe 1 (ID: ${game.Team1_Id}) appartient au club: ${name}`);
                    }
                    if (club.teamIds.includes(game.Team2_Id)) {
                        team2Club = club;
                        console.log(`Équipe 2 (ID: ${game.Team2_Id}) appartient au club: ${name}`);
                    }
                }
                
                if (team1Club && team2Club) {
                    // Incrémenter le nombre de matchs joués
                    team1Club.matchesPlayed++;
                    team2Club.matchesPlayed++;
                    
                    // Déterminer le résultat
                    if (game.Team1_Score > game.Team2_Score) {
                        console.log(`Club "${team1Club.name}" gagne`);
                        team1Club.wins++;
                        team1Club.points += 3;
                        team2Club.losses++;
                    } else if (game.Team1_Score < game.Team2_Score) {
                        console.log(`Club "${team2Club.name}" gagne`);
                        team2Club.wins++;
                        team2Club.points += 3;
                        team1Club.losses++;
                    } else {
                        console.log('Match nul');
                        team1Club.draws++;
                        team2Club.draws++;
                        team1Club.points += 1;
                        team2Club.points += 1;
                    }
                } else {
                    console.log('ATTENTION: Un ou les deux clubs ne sont pas trouvés!');
                    if (!team1Club) {
                        console.log(`Club pour l'équipe 1 (ID: ${game.Team1_Id}) non trouvé`);
                        
                        // Essayer de trouver l'équipe directement dans le tableau d'équipes
                        const team1 = teams.find(t => t.Team_Id === game.Team1_Id);
                        if (team1) {
                            console.log(`Cette équipe existe pourtant: ${team1.name}, ${team1.age_category}`);
                        } else {
                            console.log(`L'équipe ${game.Team1_Id} n'existe pas dans la liste des équipes du tournoi!`);
                        }
                    }
                    if (!team2Club) {
                        console.log(`Club pour l'équipe 2 (ID: ${game.Team2_Id}) non trouvé`);
                        
                        // Essayer de trouver l'équipe directement dans le tableau d'équipes
                        const team2 = teams.find(t => t.Team_Id === game.Team2_Id);
                        if (team2) {
                            console.log(`Cette équipe existe pourtant: ${team2.name}, ${team2.age_category}`);
                        } else {
                            console.log(`L'équipe ${game.Team2_Id} n'existe pas dans la liste des équipes du tournoi!`);
                        }
                    }
                }
            } else {
                console.log(`\nMatch ${game.Game_Id} pas encore terminé`);
            }
        });
        
        console.log('\n=== CLASSEMENT FINAL PAR CLUB ===');
        
        // Convertir la Map en tableau pour pouvoir le trier
        const clubStandings = Array.from(clubsMap.values());
        
        // Trier le classement
        clubStandings.sort((a, b) => {
            // D'abord par points
            if (b.points !== a.points) {
                return b.points - a.points;
            }
            // Ensuite par victoires
            if (b.wins !== a.wins) {
                return b.wins - a.wins;
            }
            // Ensuite par matchs joués (moins de matchs joués = meilleur classement à points égaux)
            return a.matchesPlayed - b.matchesPlayed;
        });
        
        clubStandings.forEach((club, index) => {
            console.log(`${index + 1}. ${club.name} - ${club.points} pts (${club.wins}V-${club.draws}N-${club.losses}D, ${club.matchesPlayed} matchs)`);
            console.log(`   Équipes: [${club.teamIds.join(', ')}]`);
        });
        
    } catch (error) {
        console.error('Erreur:', error);
    }
    
    process.exit(0);
}

debugStandings();

debugStandings();
