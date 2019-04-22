$(document).ready(function() {
    // classes/characters
    var characters = {
      "Obi-Wan Kenobi": {
        name: "Obi-Wan Kenobi",
        health: 120,
        attack: 8,
        imageUrl: "assets/images/obi-wan.jpg",
        enemyAttackBack: 15
      },
      "Luke Skywalker": {
        name: "Luke Skywalker",
        health: 100,
        attack: 14,
        imageUrl: "assets/images/luke-skywalker.jpg",
        enemyAttackBack: 5
      },
      "Darth Sidious": {
        name: "Darth Sidious",
        health: 150,
        attack: 8,
        imageUrl: "assets/images/darth-sidious.png",
        enemyAttackBack: 20
      },
      "Darth Maul": {
        name: "Darth Maul",
        health: 180,
        attack: 7,
        imageUrl: "assets/images/darth-maul.jpg",
        enemyAttackBack: 25
      }
    };
  
    // selected character.
    var attacker;
    // the characters not selected
    var combatants = [];
    // chosen opponent
    var defender;
    // keep track of turns
    var turnCounter = 1;
    // number of kills
    var killCount = 0;
  
    // renders characters to the page
    var renderCharacter = function(character, renderArea) {
      var charDiv = $("<div class='character' data-name='" + character.name + "'>");
      var charName = $("<div class='character-name'>").text(character.name);
      var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
      var charHealth = $("<div class='character-health'>").text(character.health);
      charDiv.append(charName).append(charImage).append(charHealth);
      $(renderArea).append(charDiv);
    };
  
    // characters to be selected
    var initializeGame = function() {
      for (var key in characters) {
        renderCharacter(characters[key], "#characters-section");
      }
    };
  
    initializeGame();
  
    
    // update character area
    var updateCharacter = function(charObj, areaRender) {
      
      $(areaRender).empty();
      renderCharacter(charObj, areaRender);
    };
  
    // available-to-attack enemies.
    var renderEnemies = function(enemyArr) {
      for (var i = 0; i < enemyArr.length; i++) {
        renderCharacter(enemyArr[i], "#available-to-attack-section");
      }
    };
  
    //  game messages.
    var renderMessage = function(message) {
      // message to the page.
      var gameMessageSet = $("#game-message");
      var newMessage = $("<div>").text(message);
      gameMessageSet.append(newMessage);
    };
  
    // restarting the game after victory or defeat.
    var restartGame = function(resultMessage) {
      // When restart is clicked, reloads the page.
      var restart = $("<button>Restart</button>").click(function() {
        location.reload();
      });
  
      // victory/defeat message
      var gameState = $("<div>").text(resultMessage);
  
      // restart/victory
      $("body").append(gameState);
      $("body").append(restart);
    };
  
    // clear the game message section
    var clearMessage = function() {
      var gameMessage = $("#game-message");
  
      gameMessage.text("");
    };
  
    // On click event for selecting our character
    $("#characters-section").on("click", ".character", function() {
      
      var name = $(this).attr("data-name");
  
      // If a player character has not been chosen
      if (!attacker) {
        // give attacker the selected character's information.
        attacker = characters[name];

        for (var key in characters) {
          if (key !== name) {
            combatants.push(characters[key]);
          }
        }
  
        $("#characters-section").hide();
  
        // Then render our selected character and our combatants.
        updateCharacter(attacker, "#selected-character");
        renderEnemies(combatants);
      }
    });
  
    // Creates click event for each enemy
    $("#available-to-attack-section").on("click", ".character", function() {
      // Saving the opponent's name.
      var name = $(this).attr("data-name");
  
      // If there is no defender, the clicked enemy will become the defender
      if ($("#defender").children().length === 0) {
        defender = characters[name];
        updateCharacter(defender, "#defender");
  
      
        $(this).remove();
        clearMessage();
      }
    });
  
    // When you click the attack button 
    $("#attack-button").on("click", function() {
      // If there is a defender
      if ($("#defender").children().length !== 0) {
        //messages for attack and counter attack.
        var attackMessage = "You attacked " + defender.name + " for " + attacker.attack * turnCounter + " damage.";
        var counterAttackMessage = defender.name + " attacked you back for " + defender.enemyAttackBack + " damage.";
        clearMessage();
  
        // Reduce defender's health by your attack value.
        defender.health -= attacker.attack * turnCounter;
  
        // If the enemy still has health.
        if (defender.health > 0) {
          // Render the enemy's updated character card.
          updateCharacter(defender, "#defender");
  
          // Render the combat messages.
          renderMessage(attackMessage);
          renderMessage(counterAttackMessage);
  
          // Reduce your health by the opponent's attack value
          attacker.health -= defender.enemyAttackBack;
  
          // Render the player's updated character card
          updateCharacter(attacker, "#selected-character");
  
          // If you have less than zero health the game ends
          // restart the game
          if (attacker.health <= 0) {
            clearMessage();
            restartGame("You have been defeated...GAME OVER!!!");
            $("#attack-button").off("click");
          }
        }
        else {
          // If the opponent has less than zero health
          // Remove character card.
          $("#defender").empty();
  
          var gameStateMessage = "You have defeated " + defender.name + ", you can choose to fight another enemy.";
          renderMessage(gameStateMessage);
  
          // Increment your kill count.
          killCount++;
  
          // If you have killed all of your opponents you win
          if (killCount >= combatants.length) {
            clearMessage();
            $("#attack-button").off("click");
            restartGame("You Won!!!! GAME OVER!!!");
          }
        }
        // turn counter
        turnCounter++;
      }
      else {
        // If there is no defender
        clearMessage();
        renderMessage("No enemy here.");
      }
    });
  });
  