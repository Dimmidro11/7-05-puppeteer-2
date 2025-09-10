Feature: Booking tickets for Movie
    Scenario: Booking one vip seat
        Given user is on booking page
        When user booking a movie day "Чт"
        And user booking a movie session "00:00"
        And user booking "vip" seat
        And user confirm seat
        And user buy ticket
        Then booking confirmed

    Scenario: Booking two standart seat
        Given user is on booking page
        When user booking a movie day "Вс"
        And user booking a movie session "13:00"
        And user booking "standart" seat
        And user booking "standart" seat
        And user confirm seat
        And user buy ticket
        Then booking confirmed

    Scenario: Attempt to reserve an taken seat
        Given user is on booking page
        When user booking a movie day "Вс"
        And user booking a movie session "13:00"
        And user booking taken seat
        Then booking confirmation button disabled