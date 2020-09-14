import { RouterTestingModule } from '@angular/router/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MemoizedSelector } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CustomModalService } from 'src/app/services/custom-modal/custom-modal.service';
import { State } from 'src/app/state/definition';
import { QuestionGroup } from 'src/app/state/questionGroups/entities';
import { selectQuestionGroups } from 'src/app/state/questionGroups/selectors';
import { Given } from 'src/app/state/questionGroups/shared/questionGroups.fixtures';
import { ActionsMenuComponent } from './actions-menu/actions-menu.component';
import { HomePageComponent } from './home-page.component';

const initialState: State = {
  answers: [],
  questions: [],
  questionGroups: [],
  currentQuestionGroup: { id: 0, name: '' },
  loader: { isActive: false, pendingRequests: 0 }
};

describe('The home page component', () => {
  let spectator: Spectator<HomePageComponent>;
  let mockStore: MockStore;
  let mockQuestionGroupsSelector: MemoizedSelector<State, QuestionGroup[]>;
  const createComponent = createComponentFactory({
    component: HomePageComponent,
    declarations: [ActionsMenuComponent],
    imports: [RouterTestingModule],
    providers: [CustomModalService, provideMockStore({ initialState })]
  });

  beforeEach(() => {
    spectator = createComponent();
    mockStore = spectator.inject(MockStore);
    mockQuestionGroupsSelector = mockStore.overrideSelector(selectQuestionGroups, []);
  });

  it('should be created', () => {
    expect(spectator.fixture.componentInstance).toBeTruthy();
  });

  it('should show the question group name', () => {
    const a_question_group_list = [Given.a_question_group()];
    mockQuestionGroupsSelector.setResult(a_question_group_list);

    mockStore.refreshState();
    spectator.detectChanges();

    expect(spectator.query('.question-group-name').textContent.trim()).toEqual(a_question_group_list[0].name);
  });
});
